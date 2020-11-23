import { setupFireStorage, setupFireStore } from './firebase';

export async function getFileList(): Promise<any[]> {
  const fireStorage = setupFireStorage();
  const fileIdList = {};
  const fileListPromises = [];
  const fileBuckets = await fireStorage.bucket().getFiles();
  for(const files of fileBuckets){
    for(const file of files){
      const fileMeta = {
        name: file.id,
        price: 1000,
        currency: "JPY",
        image_id: file.metadata.id,
        image_url: "https://firebasestorage.googleapis.com/v0" + file.parent.baseUrl + "/" + file.parent.id + file.baseUrl + "/" + file.id + "?alt=media",
        content_type: file.metadata.contentType,
        file_size: file.metadata.size,
        created_at: file.metadata.timeCreated,
        updated_at: file.metadata.updated,
      }
      fileListPromises.push(updateOrGetFileMeta(fileMeta));
    }
  }
  const fileMetaList = await Promise.all(fileListPromises);
  for(const fileMeta of fileMetaList){
    fileIdList[fileMeta.name] = fileMeta;
  }
  return Object.values(fileIdList);
}

async function updateOrGetFileMeta(fileMeta: any){
  const firestore = setupFireStore();
  const productMeta = await firestore.collection("Products").doc(fileMeta.image_id).get()
  const productMetaData = productMeta.data();
  if(productMetaData){
    return productMetaData;
  } else {
    const result = await firestore.collection("Products").doc(fileMeta.image_id).set(fileMeta);
    return fileMeta;
  }
}