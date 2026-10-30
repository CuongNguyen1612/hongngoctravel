import {$,api,message,initLanguage} from './common.js';
initLanguage();
$('#login-form').addEventListener('submit',async event=>{
  event.preventDefault();const form=event.currentTarget,button=$('button',form);button.disabled=true;message($('#login-error'),'');
  try{await api('/api/admin/login',Object.fromEntries(new FormData(form)));location.assign('/quan-ly');}
  catch(error){message($('#login-error'),error.message);button.disabled=false;}
});
