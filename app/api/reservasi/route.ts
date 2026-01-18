import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to submit reservation data to Google Sheets via Google Apps Script
 * Note: Google Sheets API requires OAuth2/Service Account for write operations.
 * This route uses Google Apps Script Web App as a proxy for easier setup.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get Google Apps Script Web App URL from environment
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL || '';
    
    if (!scriptUrl) {
      return NextResponse.json(
        { error: 'Google Apps Script URL is not configured. Please set NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL in your environment variables.' },
        { status: 500 }
      );
    }

    // Prepare data to send to Apps Script
    const payload = {
      nama: body.nama || '',
      jumlahOrang: body.jumlahOrang || '',
      tempat: body.tempat || '',
      tanggal: body.tanggal || '',
      jam: body.jam || '',
      menu: body.menu || '',
      totalHarga: body.totalHarga || '',
      idWa: body.idWa || '',
      noWa: body.noWa || '',
      catatan: body.catatan || '',
    };

    console.log('Sending data to Google Apps Script:', {
      url: scriptUrl,
      payload: payload,
    });

    // Send POST request to Google Apps Script Web App
    // Note: Google Apps Script may redirect, so we need to handle that
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow', // Follow redirects
    });

    const responseText = await response.text();
    console.log('Google Apps Script response:', {
      status: response.status,
      statusText: response.statusText,
      responseText: responseText.substring(0, 500), // Limit log size
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      console.error('Google Apps Script error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return NextResponse.json(
        { 
          error: 'Failed to submit data to spreadsheet',
          details: errorData.error || errorData.message || 'Unknown error'
        },
        { status: response.status }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      // If response is not JSON, check if it's HTML (redirect page)
      if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
        console.warn('Google Apps Script returned HTML instead of JSON. This might indicate a redirect or authorization issue.');
        // Still return success, as Google Apps Script might have processed the request
        result = { success: true, warning: 'Response was HTML, but request may have succeeded' };
      } else {
        result = { success: true };
      }
    }
    
    console.log('Google Apps Script result:', result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error submitting reservation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit reservation data',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

