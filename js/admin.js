import {$,escapeHtml as e,api,message,setupDialog,initLanguage,getLanguage,t} from './common.js';
initLanguage();
import {statusLabels,displayDate} from './booking.js';
import {todayVN,services} from './services.js';
import {money} from './tours.js';
let state={bookings:[],vehicles:[],users:[]};
function initCatalogPanels(){
  const main=document.querySelector('.admin-main');
  if(document.querySelector('#panel-tours')) return;
  main.insertAdjacentHTML('beforeend','<section class="admin-panel" id="panel-tours" hidden><div class="panel-heading"><h2>Quản lý tour</h2><button class="button" id="add-tour">Thêm tour +</button></div><div class="table-scroll"><table><thead><tr><th>Tên tour</th><th>Số ngày</th><th>Giá</th><th>Thao tác</th></tr></thead><tbody id="tours-body"></tbody></table></div></section><section class="admin-panel" id="panel-services" hidden><div class="panel-heading"><h2>Dịch vụ xe</h2><button class="button" id="add-service">Thêm dịch vụ +</button></div><div class="table-scroll"><table><thead><tr><th>Tên dịch vụ</th><th>Số chỗ</th><th>Giá</th><th>Thao tác</th></tr></thead><tbody id="services-body"></tbody></table></div></section>');
  $('#add-tour').onclick=()=>{openDialog('Thêm tour','<form class="lookup-form"><label>Mã tour<input name="id" required></label><label>Tên tour<input name="name" required></label><label>Ảnh tour (đường dẫn)<input name="image" placeholder="/north.jpg"></label><label>Số ngày<input name="days" type="number" min="1" required></label><label>Giá<input name="price" type="number" min="0" required></label><label>Nhãn<input name="tag"></label><label>Điểm dừng<input name="stops"></label><button class="button" type="submit">Lưu</button></form>');$('form',dialog).onsubmit=async ev=>{ev.preventDefault();const v=Object.fromEntries(new FormData(ev.target));await api('/api/admin',{action:'catalog_save',kind:'tour',mode:'add',id:v.id,name:v.name,image:v.image||'/north.jpg',days:Number(v.days),price:Number(v.price),tag:v.tag||'',stops:v.stops||'',plan:[v.name]});dialog.close();location.reload();};};
  $('#add-service').onclick=()=>{openDialog('Thêm dịch vụ xe','<form class="lookup-form"><label>Mã dịch vụ<input name="id" required></label><label>Tên dịch vụ<input name="name" required></label><label>Giá<input name="price" type="number" min="0" required></label><label>Số chỗ<select name="capacity"><option value="7">7</option><option value="16">16</option></select></label><button class="button" type="submit">Lưu</button></form>');$('form',dialog).onsubmit=async ev=>{ev.preventDefault();const v=Object.fromEntries(new FormData(ev.target));await api('/api/admin',{action:'catalog_save',kind:'service',mode:'add',id:v.id,name:v.name,price:Number(v.price),capacity:Number(v.capacity),group:v.capacity});dialog.close();location.reload();};};
  api('/api/admin/catalog').then(data=>{ $('#tours-body').innerHTML=data.tours.map(x=>`<tr><td>${e(x.name)}</td><td>${x.days}</td><td>${money(x.price)}</td><td><button class="button secondary" data-catalog-edit="tour" data-catalog-id="${e(x.id)}">Sửa</button> <button class="button danger" data-catalog-delete="tour" data-catalog-id="${e(x.id)}">Xóa</button></td></tr>`).join(''); $('#services-body').innerHTML=data.services.map(x=>`<tr><td>${e(x.name)}</td><td>${x.capacity}</td><td>${money(x.price)}</td><td><button class="button secondary" data-catalog-edit="service" data-catalog-id="${e(x.id)}">Sửa</button> <button class="button danger" data-catalog-delete="service" data-catalog-id="${e(x.id)}">Xóa</button></td></tr>`).join(''); }).catch(handleError);
}
initCatalogPanels();
document.addEventListener('click',async event=>{
  const btn=event.target.closest('[data-catalog-delete],[data-catalog-edit]'); if(!btn)return;
  const kind=btn.dataset.catalogDelete||btn.dataset.catalogEdit,id=btn.dataset.catalogId;
  if(btn.dataset.catalogDelete){if(!confirm('Xóa mục này khỏi danh sách?'))return;try{await api('/api/admin',{action:'catalog_delete',kind,id});location.reload();}catch(error){handleError(error);}return;}
  try{const data=await api('/api/admin/catalog');const item=(kind==='tour'?data.tours:data.services).find(x=>x.id===id);if(!item)return;
    const tour=kind==='tour';openDialog(tour?'Sửa tour':'Sửa dịch vụ xe',`<form class="lookup-form"><label>Mã<input name="id" value="${e(item.id)}" readonly></label><label>Tên<input name="name" value="${e(item.name)}" required></label>${tour?`<label>Ảnh tour (đường dẫn)<input name="image" value="${e(item.image||'/north.jpg')}"></label><label>Số ngày<input name="days" type="number" value="${item.days}" required></label><label>Nhãn<input name="tag" value="${e(item.tag||'')}"></label><label>Điểm dừng<input name="stops" value="${e(item.stops||'')}"></label>`:`<label>Số chỗ<select name="capacity"><option value="7" ${item.capacity===7?'selected':''}>7</option><option value="16" ${item.capacity===16?'selected':''}>16</option></select></label>`}<label>Giá<input name="price" type="number" value="${item.price}" required></label><button class="button" type="submit">Lưu thay đổi</button></form>`);
    $('form',dialog).addEventListener('submit',async ev=>{ev.preventDefault();const v=Object.fromEntries(new FormData(ev.target));const body={action:'catalog_save',kind,mode:'edit',id:v.id,name:v.name,price:Number(v.price),...(tour?{image:v.image||'/north.jpg',days:Number(v.days),tag:v.tag||'',stops:v.stops||'',plan:item.plan||[item.name]}:{capacity:Number(v.capacity),group:String(v.capacity)})};try{await api('/api/admin',body);dialog.close();location.reload();}catch(error){message($('#dialog-error'),error.message);}});
  }catch(error){handleError(error);}
});
const dialog=$('#admin-dialog');setupDialog(dialog);
const availability=$('#availability');availability.elements.from.value=todayVN();availability.elements.to.value=todayVN();
function notify(text,error=false){$('#admin-message').className=error?'form-error':'notice';message($('#admin-message'),text);}
function handleError(error){if(error.status===401){location.assign('/quan-ly/dang-nhap');return;}notify(error.message,true);}
async function reload(){
  const params=new URLSearchParams(new FormData(availability));
  const data=await api('/api/admin?'+params);state={...state,...data};
  $('#admin-name').textContent=state.user.name;
  $('#users-tab').hidden=state.user.role!=='owner';
  if(state.user.role==='owner')state.users=(await api('/api/admin/users')).users;
  render();
}
function render(){
  $('#stats').innerHTML=[[t('Tổng đội xe'),state.vehicles.length],[t('Xe trống trong khoảng đã chọn'),state.vehicles.filter(v=>v.available).length],[t('Yêu cầu đang chờ'),state.bookings.filter(b=>b.status==='pending').length],[t('Đơn đã xác nhận'),state.bookings.filter(b=>b.status==='confirmed').length]].map(([label,n])=>`<div><span>${label}</span><strong>${n}</strong></div>`).join('');
  const filter=$('#booking-filter').value;
  const labels=getLanguage()==='en'?{pending:'Awaiting confirmation',confirmed:'Confirmed',completed:'Completed',cancelled:'Cancelled'}:statusLabels;
  $('#bookings-body').innerHTML=state.bookings.filter(b=>filter==='all'||filter===b.status).map(b=>`<tr><td>${e(b.name)}<small class="cell-sub">${e(b.phone)}</small></td><td>${e(b.service_name)}<small class="cell-sub">${money(b.price)}</small><small class="cell-sub payment-${b.payment_status}">Cọc: ${money(b.deposit_amount)} · ${b.payment_status==='paid'?'Đã cọc':'Chưa cọc'}</small></td><td>${displayDate(b.departure_date)}<small class="cell-sub">${getLanguage()==='en'?'to':'đến'} ${displayDate(b.end_date)}</small></td><td><span class="status-pill ${b.status}">${e(labels[b.status])}</span></td><td><button data-order="${b.id}" class="text-link">${getLanguage()==='en'?'Details →':'Chi tiết →'}</button></td></tr>`).join('')||`<tr><td colspan="5">${getLanguage()==='en'?'No bookings in this status.':'Chưa có đơn trong trạng thái này.'}</td></tr>`;
  $('#vehicles-body').innerHTML=state.vehicles.map(v=>`<tr><td>${e(v.plate)}</td><td>${e(v.name)}</td><td>${v.seats}</td><td>${v.available?'Xe trống':v.active?'Có lịch':'Đã ngừng'}</td><td><div class="vehicle-actions"><button class="button secondary" data-vehicle="${v.id}">${v.active?'Ngừng hoạt động':'Kích hoạt'}</button><button class="button action-edit" data-edit-vehicle="${v.id}">Sửa</button><button class="button action-delete" data-delete-vehicle="${v.id}">Xóa</button></div></td></tr>`).join('')||'<tr><td colspan="5">Chưa có xe. Thêm xe để bắt đầu phân lịch.</td></tr>';
  $('#users-body').innerHTML=state.users.map(u=>`<tr><td>${e(u.name)}</td><td>${e(u.username)}</td><td>${u.role==='owner'?'Chủ tài khoản':'Nhân viên'}</td><td>${u.role==='staff'?`<button class="button secondary" data-user="${u.id}">${u.active?'Khóa tài khoản':'Kích hoạt'}</button>`:'Đang hoạt động'}</td></tr>`).join('');
}
function openDialog(title,html){$('#admin-dialog-title').textContent=title;$('#admin-dialog-content').innerHTML=html;message($('#dialog-error'),'');dialog.showModal();}
function bindForm(path,makeBody,after){
  const form=$('form',dialog);
  form.addEventListener('submit',async event=>{
    event.preventDefault();const button=$('[type=submit]',form);button.disabled=true;message($('#dialog-error'),'');
    try{await api(path,makeBody(Object.fromEntries(new FormData(form))));dialog.close();if(after)after();else{notify('Đã lưu thay đổi.');await reload();}}
    catch(error){message($('#dialog-error'),error.message);button.disabled=false;}
  });
}
async function openOrder(id){
  const b=state.bookings.find(row=>row.id===id);let vehicles=[],requiredSeats=b.guests<=7?7:16;
  if(b.status==='pending'){
    const data=await api('/api/admin?'+new URLSearchParams({from:b.departure_date,to:b.end_date}));
    vehicles=data.vehicles.filter(v=>v.available&&v.seats===requiredSeats);
  }
  openDialog('Chi tiết đặt chỗ',`<div class="order-details"><p><b>${e(b.name)}</b><br>${e(b.phone)}<br>${e(b.email)}</p><p>${e(b.service_name)}<br>${displayDate(b.departure_date)} – ${displayDate(b.end_date)}<br>${b.guests} khách · ${money(b.price)}</p><p><b>Tiền cọc 50%: ${money(b.deposit_amount)}</b><br><span class="payment-${b.payment_status}">${b.payment_status==='paid'?'Đã cọc':'Chưa cọc'}</span></p><p>Mã: SF-${e(b.id.toUpperCase())}</p><p>Ghi chú khách: ${e(b.note||'Không có')}</p><p>Trạng thái: ${e(statusLabels[b.status])}${b.plate?` · ${e(b.plate)}`:''}</p></div><form class="lookup-form">${b.status==='pending'?`<label>Chọn xe trống<select name="vehicleId"><option value="">Chọn xe phù hợp</option>${vehicles.map(v=>`<option value="${v.id}">${e(v.plate)} · ${e(v.name)}</option>`).join('')}</select></label><small>${vehicles.length} xe phù hợp trong toàn bộ hành trình.</small>`:''}<label>Ghi chú quản lý (bắt buộc khi hủy)<textarea name="note" maxlength="1000" rows="3">${e(b.admin_note)}</textarea></label><div class="order-actions">${b.status==='pending'?'<button class="button" type="submit" value="confirm">Phân xe & xác nhận</button>':''}${['pending','confirmed'].includes(b.status)?'<button class="button danger" type="submit" value="cancel">Hủy đơn</button>':''}${b.status==='confirmed'?'<button class="button secondary" type="submit" value="complete">Hoàn thành</button>':''}</div></form>`);
  const form=$('form',dialog);
  form.addEventListener('submit',async event=>{
    event.preventDefault();const action=event.submitter?.value;if(!action)return;
    const input=Object.fromEntries(new FormData(form));
    if(action==='confirm'&&!input.vehicleId){message($('#dialog-error'),'Vui lòng chọn xe.');return;}
    if(action==='cancel'&&input.note.trim().length<3){message($('#dialog-error'),'Cần ghi lý do hủy ít nhất 3 ký tự.');return;}
    const buttons=[...form.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);
    try{await api('/api/admin',{...input,action,id});dialog.close();notify('Đã cập nhật đơn.');await reload();}
    catch(error){message($('#dialog-error'),error.message);buttons.forEach(b=>b.disabled=false);}
  });
}
$('#add-vehicle').addEventListener('click',()=>{
  openDialog('Thêm xe',`<form class="lookup-form"><label>Biển số<input name="plate" required minlength="4" maxlength="20"></label><label>Tên xe<input name="name" required minlength="2" maxlength="80"></label><label>Số chỗ<select name="seats"><option value="7">7 chỗ</option><option value="16">16 chỗ</option></select></label><button class="button" type="submit">Lưu xe</button></form>`);
  bindForm('/api/admin',data=>({...data,action:'add_vehicle',seats:Number(data.seats)}));
});
$('#add-user').addEventListener('click',()=>{
  openDialog('Thêm nhân viên',`<form class="lookup-form"><label>Họ tên<input name="name" required minlength="2" maxlength="80"></label><label>Tên đăng nhập<input name="username" required pattern="[a-z0-9_]{3,40}" autocomplete="off"></label><label>Mật khẩu (ít nhất 12 ký tự)<input name="password" type="password" required minlength="12" maxlength="128" autocomplete="new-password"></label><button class="button" type="submit">Tạo tài khoản</button></form>`);
  bindForm('/api/admin/users',data=>({...data,action:'create'}));
});
$('#password-button').addEventListener('click',()=>{
  openDialog('Đổi mật khẩu',`<form class="lookup-form"><label>Mật khẩu hiện tại<input name="oldPassword" type="password" autocomplete="current-password" required maxlength="128"></label><label>Mật khẩu mới<input name="newPassword" type="password" autocomplete="new-password" required minlength="12" maxlength="128"></label><label>Nhập lại mật khẩu mới<input name="confirm" type="password" autocomplete="new-password" required minlength="12" maxlength="128"></label><button class="button" type="submit">Đổi mật khẩu</button></form>`);
  bindForm('/api/admin/password',data=>{if(data.newPassword!==data.confirm)throw new Error('Hai mật khẩu mới chưa khớp.');return data;},()=>location.assign('/quan-ly/dang-nhap'));
});
$('#booking-filter').addEventListener('change',render);
$('#refresh').addEventListener('click',()=>reload().catch(handleError));
availability.addEventListener('submit',event=>{event.preventDefault();reload().catch(handleError);});
$('#logout').addEventListener('click',()=>api('/api/admin/logout',{}).then(()=>location.assign('/quan-ly/dang-nhap')).catch(handleError));
document.addEventListener('click',async event=>{
  const button=event.target.closest('button');if(!button)return;
  try{
    if(button.dataset.panel){document.querySelectorAll('.admin-panel').forEach(p=>p.hidden=p.id!=='panel-'+button.dataset.panel);document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('secondary',b!==button));}
    if(button.dataset.order)await openOrder(button.dataset.order);
    if(button.dataset.vehicle){const v=state.vehicles.find(v=>v.id===button.dataset.vehicle);button.disabled=true;await api('/api/admin',{action:'set_active',id:v.id,active:!v.active});await reload();}
    if(button.dataset.editVehicle){const v=state.vehicles.find(v=>v.id===button.dataset.editVehicle);openDialog('Sửa xe',`<form class="lookup-form"><label>Biển số<input name="plate" value="${e(v.plate)}" required></label><label>Tên xe<input name="name" value="${e(v.name)}" required></label><label>Số chỗ<select name="seats"><option value="7" ${v.seats===7?'selected':''}>7 chỗ</option><option value="16" ${v.seats===16?'selected':''}>16 chỗ</option></select></label><button class="button" type="submit">Lưu thay đổi</button></form>`);bindForm('/api/admin',data=>({...data,action:'edit_vehicle',id:v.id,seats:Number(data.seats)}));}
    if(button.dataset.deleteVehicle){if(!confirm('Xóa xe này?')) return;button.disabled=true;await api('/api/admin',{action:'delete_vehicle',id:button.dataset.deleteVehicle});await reload();}
    if(button.dataset.user){const u=state.users.find(u=>u.id===button.dataset.user);button.disabled=true;await api('/api/admin/users',{action:'toggle',id:u.id,active:!u.active});await reload();}
  }catch(error){button.disabled=false;handleError(error);}
});
reload().catch(handleError);
