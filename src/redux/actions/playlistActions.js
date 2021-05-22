
export const addNew = (playlist) => {
    return {
        type : 'NEW_PLAYLIST',
        payload : playlist
    }
}

export const downloadOne = (item, path) => {
    return {
        type : "DOWNLOAD_ONE",
        payload : item,
        path : path
    }
}
