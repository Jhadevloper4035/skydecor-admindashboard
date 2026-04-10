import IconifyIcon from '@/components/wrappers/IconifyIcon';

const Field = ({ label, value }) => (
  <div className="d-flex mb-2">
    <span className="text-muted" style={{ minWidth: 130 }}>{label}</span>
    <span className="fw-medium">{value ?? '—'}</span>
  </div>
);

const ProductDetailView = ({ product }) => {
  const {
    productName, productCode, productType,
    category, subCategory, texture, textureCode,
    size, thickness, width, isActive,
    pdfUrlPath, createdAt, updatedAt,
  } = product;

  return (
    <div className="ps-xl-3 mt-3 mt-xl-0">
      <div className="d-flex align-items-center gap-2 mb-1">
        <span className="badge badge-soft-secondary fs-13">{productCode}</span>
        <span className={`badge badge-soft-${isActive ? 'success' : 'danger'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <h4 className="mb-3">{productName}</h4>

      <div className="mb-3 pb-3 border-bottom">
        <Field label="Product Type"  value={productType} />
        <Field label="Category"      value={category} />
        <Field label="Sub Category"  value={subCategory} />
        <Field label="Texture"       value={texture} />
        <Field label="Texture Code"  value={textureCode} />
        <Field label="Size"          value={size} />
        <Field label="Thickness"     value={thickness} />
        <Field label="Width"         value={width} />
      </div>


      {pdfUrlPath && (
        <a
          href={pdfUrlPath}
          target="_blank"
          rel="noreferrer"
          className="btn btn-danger d-inline-flex align-items-center gap-2"
        >
          <IconifyIcon icon="bx:file-pdf" className="fs-18" />
          Download PDF
        </a>
      )}
    </div>
  );
};

export default ProductDetailView;
