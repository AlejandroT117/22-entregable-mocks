module.exports={
  bytesToMb:(bytes)=>{
    return `${(bytes / 1048576).toFixed(2)} Mb`
  }
}