module.exports =  {
  trim(s){
    s = s.replace(/\s+/g,'');
    return s.trim();
  },
  fix0(n){
    return n < 10 ? '0'+n:n.toString();
  },
}
