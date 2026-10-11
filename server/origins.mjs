export function originAllowed(origin,allowedOrigins,production){
 if(!origin)return true;
 if(allowedOrigins.includes(origin))return true;
 return !production&&/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}
