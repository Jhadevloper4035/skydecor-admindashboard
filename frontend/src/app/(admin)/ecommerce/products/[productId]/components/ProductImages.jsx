const ProductImages = ({ product }) => {
  const { productName, image, applicationImage = [] } = product;

  if (!image && applicationImage.length === 0) return null;

  return (
    <div>
      {image && (
        <div className="text-center mb-3">
          <img
            src={image}
            alt={productName}
            className="img-fluid rounded"
            style={{ maxHeight: 360, objectFit: 'contain' }}
          />
        </div>
      )}

      {applicationImage.length > 0 && (
        <div>
          <p className="text-muted fs-13 mb-2 fw-medium">Application Images</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {applicationImage.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${productName} application ${idx + 1}`}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
