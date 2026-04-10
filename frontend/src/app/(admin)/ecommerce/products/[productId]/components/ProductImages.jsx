const ProductImages = ({ product }) => {
  const { productName, image } = product;

  if (!image) return null;

  return (
    <div className="text-center">
      <img
        src={image}
        alt={productName}
        className="img-fluid rounded"
        style={{ maxHeight: 360, objectFit: 'contain' }}
      />
    </div>
  );
};

export default ProductImages;
