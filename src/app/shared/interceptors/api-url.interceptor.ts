import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('Skip-Interceptor')) {
    const headers = req.headers.delete('Skip-Interceptor');
    const modifiedReq = req.clone({ headers });
    return next(modifiedReq);
  }

  const httpReq = req.clone({ url: `${environment.apiUrl}/${req.url}` });
  return next(httpReq);
};
