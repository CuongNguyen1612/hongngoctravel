import {$,escapeHtml as e,api,message,initLanguage,getLanguage,t} from './common.js';
initLanguage();
import {statusLabels,statusHelp,displayDate} from './booking.js';
import {money} from './tours.js';
const form=$('#lookup-form');
try {form.elements.id.value=decodeURIComponent(location.hash.slice(1)).replace(/^SF-/i,'');}catch {form.elements.id.value='';}
form.addEventListener('submit',async event=>{
  event.preventDefault();const button=$('button',form);button.disabled=true;message($('#lookup-error'),'');$('#lookup-result').hidden=true;
  try {
    const data=Object.fromEntries(new FormData(form));data.id=data.id.trim().replace(/^SF-/i,'').toLowerCase();
    const b=await api('/api/bookings/lookup',data);
    if(b.status==='confirmed') document.title='Đặt xe thành công · Hồng Ngọc Travel';
    const en=getLanguage()==='en';const labels=en?{pending:'Awaiting confirmation',confirmed:'Booking successful · vehicle assigned',completed:'Completed',cancelled:'Cancelled'}:{pending:statusLabels.pending,confirmed:'Đặt xe thành công · Đã phân xe',completed:statusLabels.completed,cancelled:statusLabels.cancelled};const help=en?{pending:'Your request is saved. Hồng Ngọc Travel is checking vehicle availability. No reservation or payment has been made.',confirmed:'Your booking is confirmed. The vehicle below has been assigned to your journey. Please save this reference code.',completed:'Your journey is complete. Thank you for travelling with Hồng Ngọc Travel.',cancelled:'This request was cancelled. See the note below for details.'}:{pending:statusHelp.pending,confirmed:'Đặt xe thành công. Nhân viên đã duyệt và phân xe cho hành trình của bạn. Vui lòng lưu mã đặt chỗ để xuất trình khi cần.',completed:statusHelp.completed,cancelled:statusHelp.cancelled};
    $('#lookup-result').innerHTML=`<div class="status-heading"><h2>${e(labels[b.status])}</h2></div><p>${e(help[b.status])}</p><h3>${e(b.service)}</h3><dl><div><dt>${en?'Departure date':'Ngày đi'}</dt><dd>${displayDate(b.date)}</dd></div><div><dt>${en?'End date':'Ngày kết thúc'}</dt><dd>${displayDate(b.endDate)}</dd></div><div><dt>${en?'Guests':'Số khách'}</dt><dd>${b.guests}</dd></div><div><dt>${en?'Car price':'Giá xe'}</dt><dd>${money(b.price)}</dd></div><div><dt>${en?'Deposit 50%':'Tiền cọc 50%'}</dt><dd>${money(b.depositAmount)} · ${b.paymentStatus==='paid'?(en?'Paid':'Đã cọc'):(en?'Unpaid':'Chưa cọc')}</dd></div></dl>${b.vehicle?`<div class="assigned-car">${en?'Vehicle':'Xe'}: ${e(b.vehicle.name)} · ${e(b.vehicle.plate)}</div>`:''}${b.note?`<div class="admin-note"><b>${en?'Manager note':'Ghi chú từ quản lý'}</b><p>${e(b.note)}</p></div>`:''}<p class="form-hint">${en?'Submit again to refresh the latest status.':'Gửi lại tra cứu để cập nhật trạng thái mới nhất.'}</p>`;
    $('#lookup-result').hidden=false;
  }catch(error){message($('#lookup-error'),error.message);}finally{button.disabled=false;}
});
