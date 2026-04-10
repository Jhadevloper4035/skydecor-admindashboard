import { Link } from 'react-router-dom';
import ReactTable from '@/components/Table';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const columns = [
  {
    header: 'Product',
    cell: ({ row: { original: { _id, image, productName, productCode } } }) => (
      <div className="d-flex align-items-center gap-3">
        {image && (
          <Link to={`/ecommerce/products/${_id}`}>
            <img src={image} alt={productName} className="img-fluid avatar-sm rounded" style={{ objectFit: 'cover' }} />
          </Link>
        )}
        <div>
          <h5 className="mt-0 mb-1">
            <Link to={`/ecommerce/products/${_id}`} className="text-reset">{productName}</Link>
          </h5>
          <span className="fs-13 text-muted">{productCode}</span>
        </div>
      </div>
    ),
  },
  {
    header: 'Type',
    accessorKey: 'productType',
  },
  {
    header: 'Category',
    cell: ({ row: { original: { category, subCategory } } }) => (
      <span>
        {category}
        {subCategory && subCategory !== category && (
          <span className="text-muted"> / {subCategory}</span>
        )}
      </span>
    ),
  },
  {
    header: 'Texture',
    cell: ({ row: { original: { texture, textureCode } } }) => (
      <span>
        {texture}
        {textureCode && <span className="text-muted ms-1 fs-13">({textureCode})</span>}
      </span>
    ),
  },
  {
    header: 'Size',
    cell: ({ row: { original: { size, thickness } } }) => (
      <span>
        {size}
        {thickness && <span className="text-muted ms-1 fs-13">{thickness}</span>}
      </span>
    ),
  },
  {
    header: 'Status',
    cell: ({ row: { original: { isActive } } }) => (
      <span className={`badge badge-soft-${isActive ? 'success' : 'danger'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    header: 'Action',
    cell: ({ row: { original: { _id } } }) => (
      <>
        <Link to={`/ecommerce/products/${_id}`} className="btn btn-sm btn-soft-secondary me-1">
          <IconifyIcon icon="bx:edit" className="fs-18" />
        </Link>
        <button type="button" className="btn btn-sm btn-soft-danger">
          <IconifyIcon icon="bx:trash" className="fs-18" />
        </button>
      </>
    ),
  },
];

const ProductsListTable = ({ products }) => {
  return (
    <ReactTable
      columns={columns}
      data={products}
      rowsPerPageList={[10, 25, 50, 100]}
      pageSize={10}
      tableClass="text-nowrap mb-0"
      theadClass="bg-light bg-opacity-50"
      showPagination
    />
  );
};

export default ProductsListTable;
