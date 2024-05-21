const checkPaddingNum = (md5Str, difficulty)=>{
  let zeroCnt = 0;
  for(let idx = 0; idx < difficulty;idx++){
    if (md5Str[idx] != '0')break;
    zeroCnt++;
  }
  return zeroCnt >= difficulty;
}
module.exports = {
  checkPaddingNum
}