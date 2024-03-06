import { Modal, notification, Pagination, Result, Skeleton } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useCallback, useState } from 'react';
import { ENDPOINT_PAGE_IMAGES } from '../../../configs/constants';
import {
  CANCEL,
  DELETE,
  DELETE_IN_PROGRESS,
  ERROR_GENERIC,
  POPUP_DELETE_IMAGE,
  SUCCESS_IMAGE_DELETED,
} from '../../../configs/lang';
import { useDeleteUploadedImageMutation, useGetUploadedImagesQuery } from '../../../services/api';
import { ImagePreview } from '../../ImagePreview';

const ImageGallery = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, error } = useGetUploadedImagesQuery({
    url: ENDPOINT_PAGE_IMAGES,
    params: { page },
  });
  const [deleteImage] = useDeleteUploadedImageMutation();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<UploadFile | undefined>();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const previewImages = useCallback(() => {
    if (!data?.results) {
      return [];
    }
    const previewImages: UploadFile[] = data.results.map((image) => {
      const { image: url, id } = image;

      return {
        uid: id,
        url,
        name: url.substring(url.lastIndexOf('/') + 1),
      };
    });

    return previewImages;
  }, [data?.results]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data || error) {
    return <Result status="error" title={ERROR_GENERIC} />;
  }

  const handleDelete = () => {
    if (imageToDelete) {
      setIsDeleting(true);
      deleteImage({ url: ENDPOINT_PAGE_IMAGES, id: imageToDelete.uid })
        .unwrap()
        .then(() => {
          setImageToDelete(undefined);
          setDeleteConfirmVisible(false);
          notification.success({ message: SUCCESS_IMAGE_DELETED });
        })
        .catch(() => {
          notification.error({ message: ERROR_GENERIC });
        })
        .finally(() => {
          setIsDeleting(false);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setImageToDelete(undefined);
  };

  return (
    <>
      <ImagePreview
        fileList={previewImages()}
        onRemove={(file) => {
          setDeleteConfirmVisible(true);
          setImageToDelete(file);
        }}
      />
      <Pagination
        defaultCurrent={1}
        total={data.count}
        pageSize={data.page_size}
        onChange={(page) => {
          setPage(page);
        }}
      />
      <Modal
        visible={deleteConfirmVisible}
        title={POPUP_DELETE_IMAGE}
        onOk={handleDelete}
        onCancel={cancelDelete}
        okText={isDeleting ? DELETE_IN_PROGRESS : DELETE}
        cancelText={CANCEL}
      >
        <p>{imageToDelete?.name}</p>
        <img style={{ width: '100%', maxHeight: '300px' }} src={imageToDelete?.url} />
      </Modal>
    </>
  );
};

export { ImageGallery };
