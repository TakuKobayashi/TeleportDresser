import { setupFireStorage } from './firebase';

export async function getFileList(): Promise<any[]> {
  const fireStorage = setupFireStorage();
  const fileList = [];
  const fileBuckets = await fireStorage.bucket().getFiles();
  for(const files of fileBuckets){
    for(const file of files){
      fileList.push({
        name: file.id,
        price: 1000,
        currency: "JPY",
        image_id: file.metadata.id,
        image_url: "https://firebasestorage.googleapis.com/v0" + file.parent.baseUrl + "/" + file.parent.id + file.baseUrl + "/" + file.id + "?alt=media",
        content_type: file.metadata.contentType,
        file_size: file.metadata.size,
        created_at: file.metadata.timeCreated,
        updated_at: file.metadata.updated,
      })
    }
  }
  return fileList;
}