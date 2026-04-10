import { useCallback, useState } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TextFormInput from '@/components/form/TextFormInput';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import SelectFormInput from '@/components/form/SelectFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useBlogStore from '@/store/blogStore';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const QUILL_MODULES = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }, 'blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

// Single image dropzone — file is kept for FormData, blob URL used only for preview
const ImageUpload = ({ file, previewUrl, onSelect, onRemove }) => {
  const onDrop = useCallback((accepted) => {
    if (!accepted.length) return;
    onSelect(accepted[0]);
  }, [onSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div className="mb-3">
      <label className="form-label">Blog Image</label>

      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`dropzone dropzone-custom ${isDragActive ? 'border-primary' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          <input {...getInputProps()} />
          <div className="dz-message text-center py-4">
            <IconifyIcon icon="bx:cloud-upload" width={40} height={40} className="text-muted" />
            <p className="mt-2 mb-1 text-muted">
              {isDragActive ? 'Drop image here…' : 'Drag & drop an image, or click to browse'}
            </p>
            <span className="text-muted fs-13">JPG, PNG, WebP — single file</span>
          </div>
        </div>
      ) : (
        <div className="position-relative border rounded overflow-hidden" style={{ width: '100%', maxWidth: 420, height: 220 }}>
          <img
            src={previewUrl}
            alt={file?.name}
            className="w-100 h-100"
            style={{ objectFit: 'cover', display: 'block' }}
          />
          {/* overlay: file name */}
          <div
            className="position-absolute bottom-0 start-0 end-0 px-2 py-1 text-truncate fs-12 text-white"
            style={{ background: 'rgba(0,0,0,0.50)' }}
          >
            <IconifyIcon icon="bx:image" className="me-1" />
            {file?.name}
          </div>
          {/* remove button */}
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1"
          >
            <IconifyIcon icon="bx:x" />
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

const CreateBlog = () => {
  const navigate = useNavigate();
  const { createBlog } = useBlogStore();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      url: '',
      status: 'active',
      author: 'Admin',
      meta_name: '',
      meta_tags: '',
      meta_title: '',
      meta_description: '',
    },
  });

  const handleSelectImage = useCallback((file) => {
    // Revoke previous blob URL to avoid memory leak
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, [previewUrl]);

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl('');
  }, [previewUrl]);

  const onSubmit = async (values) => {
    const payload = {
      title:            values.title,
      url:              values.url,
      text:             content,
      status:           values.status,
      author:           values.author,
      meta_name:        values.meta_name        || '',
      meta_tags:        values.meta_tags        || '',
      meta_title:       values.meta_title       || '',
      meta_description: values.meta_description || '',
      // The actual File object — store sends it as FormData field "image"
      image:            imageFile ?? '',
    };
    const result = await createBlog(payload);
    if (result) navigate('/blogs');
  };

  return (
    <>
      <PageMetaData title="Create Blog" />
      <PageBreadcrumb title="Create Blog" subName="Blogs" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={8}>
                    <TextFormInput
                      control={control}
                      name="title"
                      label="Title"
                      placeholder="e.g. Top 10 Interior Design Trends"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={4}>
                    <SelectFormInput
                      control={control}
                      name="status"
                      label="Status"
                      options={STATUS_OPTIONS}
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={8}>
                    <TextFormInput
                      control={control}
                      name="url"
                      label="URL Slug"
                      placeholder="e.g. top-10-interior-design-trends (auto-generated if empty)"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={4}>
                    <TextFormInput
                      control={control}
                      name="author"
                      label="Author"
                      placeholder="Admin"
                      containerClassName="mb-3"
                    />
                  </Col>

                  {/* Image upload with preview */}
                  <Col md={12}>
                    <ImageUpload
                      file={imageFile}
                      previewUrl={previewUrl}
                      onSelect={handleSelectImage}
                      onRemove={handleRemoveImage}
                    />
                  </Col>

                  {/* Quill rich text editor */}
                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label">Blog Content</label>
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={QUILL_MODULES}
                        placeholder="Write your blog content here..."
                        style={{ minHeight: 500 }}
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <hr className="my-3" />
                    <h6 className="text-muted mb-3">SEO / Meta Fields</h6>
                  </Col>
                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="meta_title"
                      label="Meta Title"
                      placeholder="SEO title (defaults to blog title)"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="meta_name"
                      label="Meta Name"
                      placeholder="e.g. interior-design-blog"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={12}>
                    <TextFormInput
                      control={control}
                      name="meta_tags"
                      label="Meta Tags"
                      placeholder="e.g. interior design, home decor, trends"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={12}>
                    <TextAreaFormInput
                      control={control}
                      name="meta_description"
                      label="Meta Description"
                      placeholder="Short description for search engines (150–160 chars)"
                      rows={3}
                      containerClassName="mb-3"
                    />
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-1">
                  <button type="submit" className="btn btn-primary">
                    <IconifyIcon icon="bx:check" className="me-1" />
                    Create Blog
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/blogs')}>
                    Cancel
                  </button>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateBlog;
