export const statusLabels = { pending: 'Chờ xác nhận', confirmed: 'Đặt xe thành công', completed: 'Đã hoàn thành', cancelled: 'Đã hủy' };
export const statusHelp = { pending: 'Yêu cầu đã được lưu. Hồng Ngọc Travel đang kiểm tra xe. Chưa xác nhận giữ chỗ và chưa thu tiền.', confirmed: 'Hồng Ngọc Travel đã xác nhận và phân xe cho hành trình của bạn. Vui lòng kiểm tra thông tin bên dưới. Trạng thái này không có nghĩa là đã thanh toán.', completed: 'Hành trình đã hoàn thành. Cảm ơn bạn đã đồng hành cùng Hồng Ngọc Travel.', cancelled: 'Yêu cầu đã được hủy. Xem ghi chú bên dưới để biết thêm thông tin.' };
export function phoneKey(phone) { let p = phone.replace(/\D/g, ''); if (p.startsWith('84'))
    p = '0' + p.slice(2); return p; }
export function tripDays(serviceId) { return serviceId === 'island' || serviceId === 'coast' || serviceId === '7-4d' ? 4 : ['north', 'rach-vem', 'sunset', '7-3d'].includes(serviceId) ? 3 : 1; }
export function lastDay(start, serviceId) { const d = new Date(start + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + tripDays(serviceId) - 1); return d.toISOString().slice(0, 10); }
export function dateRange(start, end) { const days = []; const d = new Date(start + 'T00:00:00Z'); while (d.toISOString().slice(0, 10) <= end && days.length < 10) {
    days.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
} return days; }
export function displayDate(date) { return date.split('-').reverse().join('/'); }
