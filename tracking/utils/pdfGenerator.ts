import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DeliveryInfo {
    tracking_number: string;
    sender_name: string;
    receiver_name: string;
    receiver_address: string;
    delivery_method: string;
    delivery_status: string;
    start_time: string;
    end_time: string;
    estimated_arrival: string;
    actual_delivery_time: string;
    current_latitude: number;
    current_longitude: number;
    current_location_address: string;
}

interface TrackingUpdate {
    id: number;
    latitude: number;
    longitude: number;
    location_address: string;
    status: string;
    notes: string;
    recorded_at: string;
}

export const generateDeliveryPDF = async (
    delivery: DeliveryInfo,
    trackingUpdates: TrackingUpdate[],
    qrCodeDataUrl?: string
) => {
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Colors
    const primaryGreen = [139, 195, 74]; // #8BC34A
    const darkGray = [45, 45, 45]; // #2d2d2d
    const lightGray = [245, 245, 245];

    let yPosition = 20;

    // ========================================
    // HEADER - Company Branding
    // ========================================

    // Green header bar
    doc.setFillColor(...primaryGreen);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('MovingCargo', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Real-Time Delivery Tracking System', 20, 32);

    // Add QR Code if available
    if (qrCodeDataUrl) {
        try {
            doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 50, 5, 30, 30);
        } catch (error) {
            console.error('Error adding QR code to PDF:', error);
        }
    }

    yPosition = 50;

    // ========================================
    // TRACKING NUMBER BOX
    // ========================================

    doc.setFillColor(...lightGray);
    doc.roundedRect(15, yPosition, pageWidth - 30, 25, 3, 3, 'F');

    doc.setTextColor(...darkGray);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TRACKING NUMBER', 20, yPosition + 8);

    doc.setFontSize(18);
    doc.setTextColor(...primaryGreen);
    doc.text(delivery.tracking_number, 20, yPosition + 18);

    // Status badge
    const statusText = delivery.delivery_status.toUpperCase();
    const statusWidth = doc.getTextWidth(statusText) + 10;

    let statusColor: number[];
    switch (delivery.delivery_status) {
        case 'delivered':
            statusColor = [76, 175, 80]; // Green
            break;
        case 'in_transit':
            statusColor = [33, 150, 243]; // Blue
            break;
        case 'cancelled':
            statusColor = [244, 67, 54]; // Red
            break;
        default:
            statusColor = [255, 193, 7]; // Yellow
    }

    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth - 20 - statusWidth, yPosition + 8, statusWidth, 10, 2, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, pageWidth - 15 - statusWidth, yPosition + 15);

    yPosition += 35;

    // ========================================
    // DELIVERY INFORMATION
    // ========================================

    doc.setTextColor(...darkGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Delivery Information', 20, yPosition);

    yPosition += 2;
    doc.setLineWidth(0.5);
    doc.setDrawColor(...primaryGreen);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 8;

    // Create two-column layout for sender and receiver
    const leftColumnX = 20;
    const rightColumnX = pageWidth / 2 + 5;
    const columnWidth = pageWidth / 2 - 25;

    // Sender Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryGreen);
    doc.text('FROM:', leftColumnX, yPosition);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    doc.text(delivery.sender_name, leftColumnX, yPosition + 6);

    // Receiver Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryGreen);
    doc.text('TO:', rightColumnX, yPosition);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);

    const receiverLines = doc.splitTextToSize(delivery.receiver_name, columnWidth);
    doc.text(receiverLines, rightColumnX, yPosition + 6);

    const addressLines = doc.splitTextToSize(delivery.receiver_address, columnWidth);
    doc.text(addressLines, rightColumnX, yPosition + 12);

    yPosition += 30;

    // ========================================
    // DELIVERY DETAILS TABLE
    // ========================================

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkGray);
    doc.text('Delivery Details', 20, yPosition);

    yPosition += 2;
    doc.setDrawColor(...primaryGreen);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 5;

    // Method icon text
    let methodIcon = '';
    let methodText = '';
    switch (delivery.delivery_method) {
        case 'road':
            methodIcon = '🚚';
            methodText = 'Road Transport';
            break;
        case 'flight':
            methodIcon = '✈️';
            methodText = 'Air Freight';
            break;
        case 'sea':
            methodIcon = '🚢';
            methodText = 'Sea Cargo';
            break;
    }

    const deliveryDetailsData = [
        ['Delivery Method', `${methodIcon} ${methodText}`],
        ['Start Time', new Date(delivery.start_time).toLocaleString()],
        ['Expected End Time', new Date(delivery.end_time).toLocaleString()],
    ];

    if (delivery.estimated_arrival) {
        deliveryDetailsData.push([
            'Estimated Arrival',
            new Date(delivery.estimated_arrival).toLocaleString()
        ]);
    }

    if (delivery.actual_delivery_time) {
        deliveryDetailsData.push([
            'Actual Delivery Time',
            new Date(delivery.actual_delivery_time).toLocaleString()
        ]);
    }

    if (delivery.current_location_address) {
        deliveryDetailsData.push([
            'Current Location',
            delivery.current_location_address
        ]);
    }

    autoTable(doc, {
        startY: yPosition,
        head: [],
        body: deliveryDetailsData,
        theme: 'plain',
        styles: {
            fontSize: 10,
            cellPadding: 3,
        },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: primaryGreen, cellWidth: 50 },
            1: { textColor: darkGray },
        },
        margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // ========================================
    // TRACKING HISTORY
    // ========================================

    if (trackingUpdates.length > 0) {
        // Check if we need a new page
        if (yPosition > pageHeight - 80) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...darkGray);
        doc.text(`Tracking History (${trackingUpdates.length} Updates)`, 20, yPosition);

        yPosition += 2;
        doc.setDrawColor(...primaryGreen);
        doc.line(20, yPosition, pageWidth - 20, yPosition);

        yPosition += 5;

        const trackingData = trackingUpdates.map((update, index) => [
            `#${trackingUpdates.length - index}`,
            update.status.replace(/_/g, ' ').toUpperCase(),
            update.location_address,
            new Date(update.recorded_at).toLocaleString(),
            update.notes || '-'
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [['#', 'Status', 'Location', 'Date & Time', 'Notes']],
            body: trackingData,
            theme: 'striped',
            headStyles: {
                fillColor: primaryGreen,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9,
            },
            styles: {
                fontSize: 8,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 30 },
                2: { cellWidth: 50 },
                3: { cellWidth: 40 },
                4: { cellWidth: 50 },
            },
            margin: { left: 20, right: 20 },
            alternateRowStyles: {
                fillColor: lightGray,
            },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // ========================================
    // FOOTER
    // ========================================

    const footerY = pageHeight - 20;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);

    const footerText = `Generated on ${new Date().toLocaleString()} | MovingCargo Delivery System`;
    const footerTextWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerTextWidth) / 2, footerY);

    // Add page border
    doc.setDrawColor(...primaryGreen);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // ========================================
    // SAVE PDF
    // ========================================

    const fileName = `MovingCargo_${delivery.tracking_number}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
};

// Export function to generate QR code as data URL
export const getQRCodeDataUrl = (trackingNumber: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            const qrSize = 200;
            canvas.width = qrSize;
            canvas.height = qrSize;

            // You'll need to use QRCode.toCanvas or similar
            // For now, we'll return empty and handle it in the component
            resolve('');
        } catch (error) {
            reject(error);
        }
    });
};