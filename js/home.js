import {tours,money} from './tours.js';
import {services,carServices,todayVN} from './services.js';
import {$,escapeHtml as e,api,message,setupDialog,t,initLanguage,translatePage,getLanguage} from './common.js';
const jeepServices=[
  {id:'jeep-rung-rach-vem',name:'Jeep Tour · Rừng & Rạch Vẹm',price:1200000,group:'jeep',capacity:6,plan:['Đón tại khách sạn – đi Jeep xuyên rừng nguyên sinh','Rạch Vẹm – cầu gỗ – làng chài – chụp ảnh theo mùa sao biển','Trả khách về khách sạn hoặc kết hợp điểm đến theo yêu cầu']},
  {id:'jeep-bac-dao',name:'Jeep Tour · Bắc Đảo trọn ngày',price:1600000,group:'jeep',capacity:6,plan:['Đón tại khách sạn – Rạch Vẹm – cung đường rừng','Gành Dầu – làng chài – ăn trưa – các điểm chụp ảnh','Ngắm hoàng hôn và trả khách về khách sạn']},
  {id:'jeep-sunset-town',name:'Jeep Tour · Rừng & Sunset Town',price:2200000,group:'jeep',capacity:6,plan:['Đón sân bay hoặc khách sạn – khám phá cung đường Jeep','Bắc Đảo – rừng nguyên sinh – làng chài – chụp ảnh','Nam Đảo – Sunset Town – Cầu Hôn – photo session','Kết thúc lịch trình và đưa khách về điểm trả']}
];
initLanguage();
const dialog=$('#booking-dialog');setupDialog(dialog);
const englishNames={'Khám phá Bắc Đảo':'Explore North Island','Rạch Vẹm & thiên nhiên':'Rach Vem & nature','Hẹn với hoàng hôn':'Sunset rendezvous','Một vòng đảo ngọc':'Pearl Island loop','Sắc màu Phú Quốc':'Phu Quoc in color','Vui chơi & khám phá':'Fun & discovery','Biển xanh & thư giãn':'Blue sea & relaxation','Check-in & trải nghiệm':'Check-ins & experiences','Bắc Đảo đến Nam Đảo':'North to South Island','Biển & phố hoàng hôn':'Sea & sunset town','VinWonders · Safari · Chợ đêm':'VinWonders · Safari · Night market','Rạch Vẹm · VinWonders · Safari':'Rach Vem · VinWonders · Safari','Sunset Town · VinWonders · Safari':'Sunset Town · VinWonders · Safari','Rạch Vẹm · Safari · Hòn Thơm':'Rach Vem · Safari · Hon Thom','Sunset Town · Bắc Đảo · Rạch Vẹm':'Sunset Town · North Island · Rach Vem'};
const localized=value=>getLanguage()==='en'?(englishNames[value]||t(value)):value;
const photoServices=[
  {id:'photo-fireworks',name:'Chụp pháo hoa',price:1500000,group:'photo',capacity:8,plan:['01 photographer – chụp lúc 21:00','Giao toàn bộ file gốc','Chỉnh sửa 10 files','Trang phục tự túc']},
  {id:'photo-personal-1h',name:'Chụp cá nhân · 1 giờ',price:1600000,group:'photo',capacity:1,plan:['01 photographer – thời gian chụp 1 giờ','Giao toàn bộ file gốc','Chỉnh sửa 10 files','Trang phục tự túc']},
  {id:'photo-couple-1h',name:'Chụp couple · 1 giờ',price:2100000,group:'photo',capacity:2,plan:['01 photographer – thời gian chụp 1 giờ','Giao toàn bộ file gốc','Chỉnh sửa 15 files','Trang phục tự túc']},
  {id:'photo-family-1h',name:'Chụp gia đình · 1 giờ',price:2600000,group:'photo',capacity:5,plan:['01 photographer – gia đình 3–5 người','Giao toàn bộ file gốc','Chỉnh sửa 20 files','Trang phục tự túc']},
  {id:'photo-personal-2h',name:'Chụp cá nhân · 2 giờ',price:2200000,group:'photo',capacity:1,plan:['01 photographer – thời gian chụp 2 giờ','Giao toàn bộ file gốc','Chỉnh sửa 20 files','Trang phục tự túc']},
  {id:'photo-couple-2h',name:'Chụp couple · 2 giờ',price:2700000,group:'photo',capacity:2,plan:['01 photographer – thời gian chụp 2 giờ','Giao toàn bộ file gốc','Chỉnh sửa 25 files','Trang phục tự túc']},
  {id:'photo-family-2h',name:'Chụp gia đình · 2 giờ',price:3500000,group:'photo',capacity:5,plan:['01 photographer – gia đình 3–5 người','Giao toàn bộ file gốc','Chỉnh sửa 30 files','Trang phục tự túc']},
  {id:'photo-edit-extra',name:'Chỉnh sửa thêm',price:25000,group:'photo',capacity:1,plan:['Chỉnh sửa thêm theo yêu cầu','Đơn giá 25.000đ / tấm','Thời gian chỉnh sửa 3–5 ngày']},
  {id:'photo-makeup-hair',name:'Makeup & tóc',price:700000,group:'photo',capacity:1,plan:['Makeup & làm tóc cho 1 người','Phù hợp trước buổi chụp','Đặt kèm cùng gói chụp ảnh']}
];
const menu=$('.menu-toggle');
const photoCardImages={'photo-personal-1h':'/photo-personal.jpg','photo-personal-2h':'/photo-personal.jpg','photo-couple-1h':'/photo-couple.jpg','photo-couple-2h':'/photo-couple.jpg','photo-family-1h':'/photo-family.jpg','photo-family-2h':'/photo-family.jpg','photo-fireworks':'/photo-fireworks.jpg'};
document.querySelectorAll('.photo-grid .card-photo[data-book]').forEach(card=>{const image=card.querySelector('img');const source=photoCardImages[card.dataset.book];if(image&&source)image.src=source;});
menu.addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
$('#navigation').addEventListener('click',()=>{$('#navigation').classList.remove('open');menu.setAttribute('aria-expanded','false');});
function renderTours(filter='all') {
  const list=tours.filter(t=>filter==='all'||String(t.days)===filter);
  $('#tour-count').textContent=`${list.length} ${getLanguage()==='en'?'journeys to explore':'hành trình để khám phá'}`;
  $('#tour-grid').innerHTML=list.map(tour=>`<article class="tour-card"><button class="card-photo" data-book="${tour.id}" aria-label="${t('Xem')} ${e(localized(tour.name))}"><img src="${tour.image}" alt="${e(localized(tour.name))}" loading="lazy"><span class="photo-tag">${e(localized(tour.tag))}</span><span class="photo-arrow">↗</span></button><div class="card-body"><div class="card-meta"><span>${tour.days} ${getLanguage()==='en'?'days':'ngày'} ${tour.days-1} ${getLanguage()==='en'?'nights':'đêm'}</span><span>${t('Xe 16 chỗ')}</span></div><h3><button data-book="${tour.id}">${e(localized(tour.name))}</button></h3><p class="stops">${e(localized(tour.stops))}</p><div class="card-bottom"><div><small>${t('Giá xe / lịch trình')}</small><strong>${money(tour.price)}</strong></div><button class="detail-button" data-book="${tour.id}">${t('Xem lịch trình →')}</button></div></div></article>`).join('');
  translatePage();
}
function renderCars(group='1') {$('#car-rates').innerHTML=carServices.filter(s=>s.group===group).map(s=>`<tr><td>${e(s.name)}</td><td class="rate-price">${money(s.price)}</td><td><button class="rate-book" data-book="${s.id}">${t('Đặt xe →')}</button></td></tr>`).join('');translatePage();}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.filter){document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderTours(button.dataset.filter);}
  if(button.dataset.car){document.querySelectorAll('[data-car]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderCars(button.dataset.car);}
  if(button.dataset.book) openBooking(button.dataset.book);
});
function openBooking(id) {
  const service=services.find(s=>s.id===id)||jeepServices.find(s=>s.id===id)||photoServices.find(s=>s.id===id),tour=tours.find(t=>t.id===id)||jeepServices.find(s=>s.id===id)||photoServices.find(s=>s.id===id);
  $('#dialog-title').textContent=localized(service.name);
  $('#tour-details').innerHTML=tour?`<div class="timeline">${tour.plan.map((p,i)=>`<div><span>${i+1}</span><div><h4>${getLanguage()==='en'?'Day':'Ngày'} ${i+1}</h4><p>${e(p)}</p></div></div>`).join('')}</div><p class="price-note">${getLanguage()==='en'?'Car price for the itinerary. Hotels, meals and attraction tickets are confirmed separately.':'Giá xe theo lịch trình. Khách sạn, bữa ăn và vé tham quan cần xác nhận riêng.'}</p>`:'';
  $('#booking-form-container').innerHTML=`<form class="booking-form" id="booking-form"><div class="booking-title"><h3>${getLanguage()==='en'?'Book this journey':'Đặt lịch hành trình'}</h3><span>${money(service.price)} <small>/ ${service.group==='route'?(getLanguage()==='en'?'route':'lượt'):(getLanguage()==='en'?'car':'xe')}</small></span></div><div class="form-grid"><label>${getLanguage()==='en'?'Departure date':'Ngày khởi hành'} *<input type="date" name="date" required min="${todayVN()}"></label><label>${getLanguage()==='en'?'Guests':'Số khách'} *<input type="number" name="guests" required min="1" max="${service.capacity}" value="2"></label><label>${getLanguage()==='en'?'Full name':'Họ và tên'} *<input name="name" autocomplete="name" required minlength="2" maxlength="100"></label><label>${getLanguage()==='en'?'Phone number':'Số điện thoại'} *<input name="phone" type="tel" autocomplete="tel" required minlength="8" maxlength="20"></label><label class="full">${getLanguage()==='en'?'Email (optional)':'Email (không bắt buộc)'}<input name="email" type="email" autocomplete="email" maxlength="254"></label><label class="full">${getLanguage()==='en'?'Notes':'Ghi chú'}<textarea name="note" maxlength="1000" rows="2" placeholder="${getLanguage()==='en'?'Pickup point, flight time, children…':'Điểm đón, giờ bay, số trẻ em…'}"></textarea></label></div><label class="consent"><input type="checkbox" name="consent" required><span>${getLanguage()==='en'?'I agree that Hồng Ngọc Travel may store my details and contact me about this booking.':'Tôi đồng ý để Hồng Ngọc Travel lưu thông tin và liên hệ về yêu cầu đặt lịch này.'}</span></label><p class="form-error" id="booking-error" role="alert" hidden></p><button class="button submit" type="submit">${getLanguage()==='en'?'Send booking request →':'Gửi yêu cầu đặt lịch →'}</button><p class="form-hint">${getLanguage()==='en'?'No payment yet. The car, services and final price will be confirmed separately.':'Chưa cần thanh toán. Xe, dịch vụ và giá cuối cùng sẽ được xác nhận riêng.'}</p></form>`;
  const form=$('#booking-form'),requestId=crypto.randomUUID();
  form.addEventListener('submit',async event=>{
    event.preventDefault();const button=$('[type=submit]',form);if(button.disabled)return;button.disabled=true;message($('#booking-error'),'');
    const data=Object.fromEntries(new FormData(form));
    try {
      const result=await api('/api/bookings',{...data,id:requestId,serviceId:id,guests:Number(data.guests),consent:true});
      const p=result.payment;
      $('#booking-form-container').innerHTML=`<div class="booking-success" role="status"><h3>Đã gửi yêu cầu thành công</h3><p>Mã tham chiếu của bạn</p><strong>${e(result.reference)}</strong><p>Yêu cầu đang chờ xác nhận. Vui lòng đặt cọc 50% để giữ lịch.</p><div class="demo-payment"><b>Thanh toán mẫu (để kiểm tra website)</b><p>Số tiền cọc: <strong>${money(p.amount)}</strong></p><p>${e(p.bankName)} · ${e(p.accountName)}<br>Số tài khoản: <strong>${e(p.accountNumber)}</strong><br>Nội dung: <strong>${e(p.content)}</strong></p><small>Đây là tài khoản giả lập, không chuyển tiền thật. Khi có MoMo doanh nghiệp, chỉ cần thay cấu hình thanh toán.</small><button class="button secondary" id="demo-paid">Tôi đã thanh toán (demo)</button><p id="demo-paid-message" class="form-hint" hidden>Đã ghi nhận thanh toán mẫu. Quản lý sẽ xác nhận lịch.</p></div><small>Lưu mã và dùng số điện thoại đã đặt để tra cứu.</small><div class="receipt-actions"><a class="button" href="/dat-cho#${requestId}">Theo dõi đặt chỗ</a><button class="button secondary" id="copy-reference">Sao chép mã</button></div></div>`;
      $('#demo-paid').addEventListener('click',async event=>{event.target.disabled=true;try{await api('/api/bookings/demo-paid',{id:requestId,phone:data.phone});$('#demo-paid-message').hidden=false;}catch(error){event.target.disabled=false;message($('#booking-error'),error.message);}});
      $('#copy-reference').addEventListener('click',async event=>{try{await navigator.clipboard.writeText(result.reference);event.target.textContent='Đã sao chép mã';}catch{event.target.textContent='Hãy chọn mã để sao chép';}});
    } catch(error){message($('#booking-error'),error.message);button.disabled=false;}
  });
  dialog.showModal();
}
renderTours();renderCars('1');
const requestedTour=new URLSearchParams(location.search).get('tour');if(requestedTour&&jeepServices.some(s=>s.id===requestedTour))openBooking(requestedTour);
window.openPhotoBooking=openBooking;
$('#photo-quick-form')?.addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.currentTarget);openBooking(form.get('photoService'));});
