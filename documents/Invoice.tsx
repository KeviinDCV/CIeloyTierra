import { Document, Footer } from "@htmldocs/react"

interface OrderItem {
  name: string
  quantity: number
  price: number
  total: number
}

interface InvoiceData {
  orderId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  total: number
  date: string
  timestamp: string
}

interface InvoiceProps {
  data: InvoiceData
}

function Invoice({ data }: InvoiceProps) {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Document size="8.5in 11in" orientation="portrait" margin="0.75in">

      <div className="space-y-6">
        {/* Company Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="text-3xl font-bold text-red-600">Cielo y Tierra</div>
          </div>
          <p className="text-sm text-gray-600">Restaurante & Eventos</p>
          <p className="text-sm text-gray-600">Tel: +57 300 123 4567 | cieloytierra@restaurant.com</p>
        </div>

        {/* Invoice Header */}
        <div className="text-center border-b-2 border-red-600 pb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">FACTURA DE VENTA</h1>
          <div className="flex justify-between text-sm">
            <span><strong>No. Factura:</strong> #{data.orderId}</span>
            <span><strong>Fecha:</strong> {currentDate}</span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Información del Cliente</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Nombre:</strong> {data.customerName}</div>
            <div><strong>Teléfono:</strong> {data.customerPhone}</div>
            <div><strong>Dirección:</strong> {data.customerAddress}</div>
            <div><strong>Fecha del Pedido:</strong> {new Date(data.timestamp).toLocaleString('es-CO')}</div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Detalle del Pedido</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-red-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Cantidad</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Precio Unit.</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    ${item.price.toLocaleString('es-CO')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    ${item.total.toLocaleString('es-CO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end">
          <div className="bg-red-600 text-white p-4 rounded-lg min-w-64">
            <div className="text-right">
              <div className="text-sm mb-2">TOTAL A PAGAR</div>
              <div className="text-2xl font-bold">
                ${data.total.toLocaleString('es-CO')} COP
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Información de Pago</h3>
          <div className="text-sm space-y-1">
            <p><strong>Métodos de Pago:</strong> Efectivo, Transferencia Bancaria, Tarjeta</p>
            <p><strong>Entrega:</strong> Domicilio incluido en el precio</p>
            <p><strong>Tiempo de Entrega:</strong> 30-45 minutos aproximadamente</p>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <p className="mb-2">¡Gracias por elegir Cielo y Tierra!</p>
          <p>Tu satisfacción es nuestra prioridad. ¡Esperamos verte pronto!</p>
        </div>
      </div>

      {/* Footer */}
      <Footer 
        position="bottom-center"
        className="text-xs text-gray-500"
        children={({ currentPage, totalPages }) => (
          <div className="text-center">
            Página {currentPage} de {totalPages} | © 2024 Cielo y Tierra - Todos los derechos reservados
          </div>
        )}
        marginBoxStyles={{
          marginBottom: '0.25in',
        }}
      />
    </Document>
  )
}

Invoice.documentId = "invoice"

export default Invoice
