import { toast } from 'react-toastify';
import { css } from 'glamor';

export function defaultToast(message) {
	toast(message, {
		className: css({
      backgroundColor: "#009688",
      color: "#FFFFFF"
    })
	});
}

export function warningToast(message) {
	toast(message, {
		autoClose: 3500,
		className: css({
      backgroundColor: "#FF9800",
      color: "#FFFFFF"
    })
	});
}