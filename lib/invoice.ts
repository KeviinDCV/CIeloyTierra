// Invoice generation utilities

export interface OrderItem {
  name: string
  quantity: number
  price: number
  total: number
}

export interface InvoiceData {
  orderId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  total: number
  date: string
  timestamp: string
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  timestamp: string
  status: 'preparing' | 'ready' | 'completed'
}

export const generateInvoice = async (order: Order): Promise<void> => {
  try {
    // Transform order data to invoice data
    const invoiceData: InvoiceData = {
      orderId: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      })),
      total: order.total,
      date: new Date().toISOString(),
      timestamp: order.timestamp
    }

    // Create the invoice HTML
    const invoiceHtml = await createInvoiceHTML(invoiceData)
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(invoiceHtml)
      printWindow.document.close()
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
    }
  } catch (error) {
    console.error('Error generating invoice:', error)
    alert('Error al generar la factura. Por favor, intenta nuevamente.')
  }
}

const createInvoiceHTML = async (data: InvoiceData): Promise<string> => {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Factura #${data.orderId} - Cielo y Tierra</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #e61d25;
          padding-bottom: 20px;
        }
        
        .company-name {
          font-size: 2.5rem;
          font-weight: bold;
          color: #e61d25;
          margin-bottom: 10px;
        }
        
        .company-info {
          color: #666;
          font-size: 0.9rem;
        }
        
        .invoice-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .invoice-title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 15px;
        }
        
        .invoice-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        
        .customer-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .customer-info h2 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }
        
        .customer-detail {
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        
        .items-section {
          margin-bottom: 30px;
        }
        
        .items-section h2 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        .items-table th,
        .items-table td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }
        
        .items-table th {
          background: #ffe6e6;
          font-weight: bold;
        }
        
        .items-table .quantity,
        .items-table .price,
        .items-table .total {
          text-align: right;
        }
        
        .total-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }
        
        .total-box {
          background: #e61d25;
          color: white;
          padding: 20px;
          border-radius: 8px;
          min-width: 250px;
          text-align: center;
        }
        
        .total-label {
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
        
        .total-amount {
          font-size: 1.8rem;
          font-weight: bold;
        }
        
        .payment-info {
          background: #fff9e6;
          border-left: 4px solid #fdb72d;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .payment-info h3 {
          color: #333;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        
        .payment-detail {
          font-size: 0.9rem;
          margin-bottom: 5px;
        }
        
        .footer-message {
          text-align: center;
          border-top: 1px solid #ddd;
          padding-top: 20px;
          color: #666;
          font-size: 0.9rem;
        }
        
        .footer-thanks {
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 15px;
          }
          
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <img src="/Logo.png" alt="Cielo y Tierra" style="width: 60px; height: 60px; margin-right: 15px; object-fit: contain;">
          <div>
            <div class="company-name">Cielo y Tierra</div>
            <div style="color: #666; font-size: 0.9rem;">Restaurante</div>
          </div>
        </div>
        <div class="company-info">
          <div>Tel: +57 300 123 4567 | cieloytierra@restaurant.com</div>
        </div>
      </div>

      <div class="invoice-header">
        <h1 class="invoice-title">FACTURA DE VENTA</h1>
        <div class="invoice-meta">
          <span><strong>No. Factura:</strong> #${data.orderId}</span>
          <span><strong>Fecha:</strong> ${currentDate}</span>
        </div>
      </div>

      <div class="customer-info">
        <h2>Información del Cliente</h2>
        <div class="customer-detail"><strong>Nombre:</strong> ${data.customerName}</div>
        <div class="customer-detail"><strong>Teléfono:</strong> ${data.customerPhone}</div>
        <div class="customer-detail"><strong>Dirección:</strong> ${data.customerAddress}</div>
        <div class="customer-detail"><strong>Fecha del Pedido:</strong> ${new Date(data.timestamp).toLocaleString('es-CO')}</div>
      </div>

      <div class="items-section">
        <h2>Detalle del Pedido</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th class="quantity">Cantidad</th>
              <th class="price">Precio Unit.</th>
              <th class="total">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td class="quantity">${item.quantity}</td>
                <td class="price">$${item.price.toLocaleString('es-CO')}</td>
                <td class="total">$${item.total.toLocaleString('es-CO')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="total-section">
        <div class="total-box">
          <div class="total-label">TOTAL A PAGAR</div>
          <div class="total-amount">$${data.total.toLocaleString('es-CO')} COP</div>
        </div>
      </div>



      <div class="footer-message">
        <div class="footer-thanks">¡Gracias por elegir Cielo y Tierra!</div>
        <div>Tu satisfacción es nuestra prioridad. ¡Esperamos verte pronto!</div>
        <br>
        <div style="font-size: 0.8rem; color: #888;">
          © 2025 Cielo y Tierra - Todos los derechos reservados
        </div>
      </div>
    </body>
    </html>
  `
}
