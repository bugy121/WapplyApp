import * as FileSystem from 'expo-file-system'

export async function getFileInfo(fileURI: string){
    const fileInfo = await FileSystem.getInfoAsync(fileURI)
    return fileInfo
}

export function filesizeToMB(fileSize: number){
    return fileSize / 1024 / 1024
 }
