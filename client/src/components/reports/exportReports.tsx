import React, { useState } from 'react';
import { Download, FileText, TrendingUp, Package, User, DollarSign, Calendar, Filter, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getReportRequest } from '../../api/sellRequests';
import { downloadCSV, downloadExcel, downloadPDF, transformOrdersToRows } from './reportTypes';


const ExportReports = () => {
  const { storeId } = useParams<{ storeId: string}>();  
  const [reportData, setReportData] = useState<any[]>([]);
  const [reportType, setReportType] = useState<string>("");
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    productId: '',
    cashierId: ''
  });
  const [loading, setLoading] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Datos de ejemplo para los selects
  const products = [
    { _id: '1', name: 'Camisa Casual Azul' },
    { _id: '2', name: 'Pantalón Denim Negro' },
    { _id: '3', name: 'Vestido Floral Verano' }
  ];

  const cashiers = [
    { _id: '1', name: 'María González' },
    { _id: '2', name: 'Juan Pérez' },
    { _id: '3', name: 'Ana Martínez' }
  ];

  const reportTypes = [
    {
      id: 'sales_by_date',
      name: 'Ventas por Rango de Fecha',
      description: 'Todas las ventas realizadas en un período específico',
      icon: Calendar,
      color: 'from-blue-600 to-blue-500',
      fields: ['startDate', 'endDate']
    },
    {
      id: 'sales_by_product',
      name: 'Ventas por Producto',
      description: 'Detalle de ventas agrupadas por producto',
      icon: Package,
      color: 'from-green-600 to-green-500',
      fields: ['startDate', 'endDate', 'productId']
    },
    {
      id: 'sales_by_cashier',
      name: 'Ventas por Cajero',
      description: 'Rendimiento de ventas por cada cajero',
      icon: User,
      color: 'from-purple-600 to-purple-500',
      fields: ['startDate', 'endDate', 'cashierId']
    },
    {
      id: 'net_profit',
      name: 'Ganancia Neta',
      description: 'Análisis de ganancias netas del período',
      icon: DollarSign,
      color: 'from-yellow-600 to-orange-500',
      fields: ['startDate', 'endDate']
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFilters = () => {
    const selectedReport = reportTypes.find(r => r.id === reportType);
    if (!selectedReport) return false;

    // Validar campos requeridos según el tipo de reporte
    for (const field of selectedReport.fields) {
      if (!filters[field]) {
        alert(`Por favor completa el campo: ${field}`);
        return false;
      }
    }

    // Validar que la fecha de inicio sea menor a la de fin
    if (filters.startDate && filters.endDate) {
      if (new Date(filters.startDate) > new Date(filters.endDate)) {
        alert('La fecha de inicio debe ser anterior a la fecha de fin');
        return false;
      }
    }

    return true;
  };

const handleExport = async (format) => {

  if (!reportType) {
    alert('Por favor selecciona un tipo de reporte');
    return;
  }

  if (!validateFilters()) {
    return;
  }

  try {

    setLoading(true);

    const res = await getReportRequest(storeId!, reportType, filters);

    const data = res.data;

    console.log("DATA DEL REPORTE:", data);
    //const reportData = transformOrdersToRows(data);

    setReportData(reportData);


    if (data.length === 0) {
      alert("No hay datos para este reporte");
      return;
    }

    if (format === "csv") {
      downloadCSV(data, reportData);
    }

    if (format === "excel") {
      downloadExcel(data, reportData);
    }

    if (format === "pdf") {
      downloadPDF(data, reportData);
    }

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);

  } catch (error) {

    console.error(error);
    alert("Error generando reporte");

  } finally {
    setLoading(false);
  }
};


  const selectedReport = reportTypes.find(r => r.id === reportType);
  const shouldShowField = (field) => {
    if (!selectedReport) return false;
    return selectedReport.fields.includes(field);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <FileText className="text-indigo-500" size={40} />
            Exportar Reportes
          </h1>
          <p className="text-gray-400">Genera y descarga reportes detallados de tus ventas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Selección de Tipo de Reporte */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tipos de Reporte */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-indigo-400" size={24} />
                Selecciona el Tipo de Reporte
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  const isSelected = reportType === report.id;
                  
                  return (
                    <button
                      key={report.id}
                      onClick={() => setReportType(report.id)}
                      className={`p-5 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'bg-gradient-to-br ' + report.color + ' border-transparent shadow-lg'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-white/20' : 'bg-gray-700'
                        }`}>
                          <Icon size={24} className={isSelected ? 'text-white' : 'text-gray-400'} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold mb-1 ${
                            isSelected ? 'text-white' : 'text-gray-200'
                          }`}>
                            {report.name}
                          </h3>
                          <p className={`text-xs ${
                            isSelected ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtros */}
            {reportType && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Filter className="text-purple-400" size={24} />
                  Filtros del Reporte
                </h2>

                <div className="space-y-4">
                  
                  {/* Rango de Fechas */}
                  {(shouldShowField('startDate') || shouldShowField('endDate')) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shouldShowField('startDate') && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-400 mb-2">
                            Fecha Inicio <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          />
                        </div>
                      )}

                      {shouldShowField('endDate') && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-400 mb-2">
                            Fecha Fin <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Producto */}
                  {shouldShowField('productId') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Producto {reportType === 'sales_by_product' && <span className="text-gray-500">(opcional - todos si está vacío)</span>}
                      </label>
                      <select
                        name="productId"
                        value={filters.productId}
                        onChange={handleFilterChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                      >
                        <option value="">Todos los productos</option>
                        {products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Cajero */}
                  {shouldShowField('cashierId') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Cajero {reportType === 'sales_by_cashier' && <span className="text-gray-500">(opcional - todos si está vacío)</span>}
                      </label>
                      <select
                        name="cashierId"
                        value={filters.cashierId}
                        onChange={handleFilterChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                      >
                        <option value="">Todos los cajeros</option>
                        {cashiers.map(cashier => (
                          <option key={cashier._id} value={cashier._id}>
                            {cashier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Panel de Exportación */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl sticky top-8">
              <h2 className="text-xl font-bold mb-6">Exportar Reporte</h2>

              {/* Información del reporte seleccionado */}
              {selectedReport ? (
                <div className={`mb-6 p-4 rounded-lg bg-gradient-to-br ${selectedReport.color}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {React.createElement(selectedReport.icon, { size: 24, className: "text-white" })}
                    <h3 className="font-bold text-white">{selectedReport.name}</h3>
                  </div>
                  <p className="text-white/80 text-sm">{selectedReport.description}</p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
                  <FileText size={48} className="mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-500 text-sm">Selecciona un tipo de reporte</p>
                </div>
              )}

              {/* Formatos de Exportación */}
              {reportType && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">Formato de Descarga</h3>
                  
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-lg ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Download size={20} />
                    {loading ? 'Generando...' : 'Descargar PDF'}
                  </button>

                  <button
                    onClick={() => handleExport('excel')}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-lg ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Download size={20} />
                    {loading ? 'Generando...' : 'Descargar Excel'}
                  </button>

                  <button
                    onClick={() => handleExport('csv')}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Download size={20} />
                    {loading ? 'Generando...' : 'Descargar CSV'}
                  </button>
                </div>
              )}

              {/* Mensaje de éxito */}
              {exportSuccess && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-400" />
                    <p className="text-sm text-green-400 font-semibold">
                      ¡Reporte generado exitosamente!
                    </p>
                  </div>
                </div>
              )}

              {/* Información adicional */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-400">
                  <span className="font-semibold">💡 Nota:</span> Los reportes incluyen toda la información relevante según el tipo seleccionado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información sobre los reportes */}
        <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4">Información de los Reportes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-indigo-400 mb-2">Ventas por Rango de Fecha</h4>
              <p className="text-gray-400">Incluye: fecha de venta, producto, cantidad, subtotal, impuestos, total, método de pago, cajero.</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Ventas por Producto</h4>
              <p className="text-gray-400">Agrupado por producto con totales de cantidad vendida, ingresos generados y ticket promedio.</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Ventas por Cajero</h4>
              <p className="text-gray-400">Rendimiento de cada cajero: ventas totales, cantidad de transacciones, ticket promedio.</p>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">Ganancia Neta</h4>
              <p className="text-gray-400">Análisis detallado: subtotal, impuestos, descuentos aplicados y ganancia neta del período.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportReports