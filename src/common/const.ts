const colors = [
  '#748084', // L1
  '#238d6f', // L2
  '#3a749f', // L3
  '#6c57a0', // L4
  '#8a5e3e', // L5
  '#97434c', // L6
];

const agentsNameMap = [
  { key: 'assault', label: '突击' },
  { key: 'project', label: '工程' },
  { key: 'support', label: '支援' },
  { key: 'scout', label: '侦察' },
];

const seasonOptions = [
  { label: '黑夜之子', value: '4' },
  { label: '焰火', value: '3' },
  { label: '聚变', value: '2' },
  { label: '起源', value: '1' },
];

const ckOptions = [
  {
    label: '浩然白帝郑居中',
    value:
      'pgv_pvid=84132458; fqm_pvqid=54ab2059-8cb0-48e8-a778-efd1a6c2a31f; fqm_sessionid=b48f988c-c83e-4685-a449-02a8ebd52fd4; pgv_info=ssid=s845046044; eas_sid=N1x7E4X7h8C2u5S1H9k1v1A5n6; RK=W59FhIIewk; ptcz=f11049812ae25906f859ee38efb5a14e1d720905c72f6786c244c8f59a68b699; dfqqcomrouteLine=record202410ver_record202410ver_record202410ver_record202410ver_record202410ver_record202410ver_record202410ver; pac_uid=0_HzJY4WtrHkK9e; omgid=0_HzJY4WtrHkK9e; _qimei_uuid42=1951b0a261b100bfedfdf2de0f7dc51b3960e75757; _qimei_fingerprint=bb8b21f3d4d59e738c1605052ab7e043; _qimei_h38=d896346cedfdf2de0f7dc51b03000001d1951b; _qimei_q36=; refresh_token=; expires_time=; iegams_milo_proxylogin_qc=101491592_%24%24_6299DAAC80EA915F34FDA0BE5A6B2635_%24%24_06105893270667501F40A99FAD3FB85A; acctype=qc; openid=6299DAAC80EA915F34FDA0BE5A6B2635; access_token=06105893270667501F40A99FAD3FB85A; appid=101491592; ieg_ams_token=; ieg_ams_session_token=; ieg_ams_token_time=; ieg_ams_sign=',
  },
  {
    label: 'Tobyouter',
    value:
      'pgv_pvid=543587950; eas_sid=g1k7D4B7Y8e2a6k6n3S7x8Y1w5; pgv_info=ssid=s4371591544; RK=m91A4AAqRt; ptcz=111ed587156f6c41fb88140d0c4e4000f3c55581a80bfc53adf118402230851b; iegams_milo_proxylogin_qc=101491592_%24%24_BE41C0491EE5F17E6DA94A72C79ADB8E_%24%24_88FF915A184100968AF6F0B51399D2F3; dfqqcomrouteLine=record202410ver_record202410ver_record202410ver_record202410ver_record202410ver; acctype=qc; openid=BE41C0491EE5F17E6DA94A72C79ADB8E; access_token=88FF915A184100968AF6F0B51399D2F3; appid=101491592; refresh_token=; ieg_ams_token=; ieg_ams_session_token=; ieg_ams_token_time=; ieg_ams_sign=; expires_time=',
  },
  {
    label: '铁板红烧鱿鱼',
    value:
      'pgv_info=ssid=s3202962438; pgv_pvid=9463615382; eas_sid=K1J7p478Q5p0x453q7Z197U8v7; RK=GbVQaBPawk; ptcz=4174c694a1d4831d8d3d8abd9d206ad91e5618a2ac8f0da010f7f242b51a89fc; iegams_milo_proxylogin_qc=101491592_%24%24_26440B7F3D3C0BA472803E8CC9CCF2AA_%24%24_FCB5074D29A743568A80EF9B2045D95D; dfqqcomrouteLine=record202410ver_record202410ver; refresh_token=; expires_time=; acctype=qc; openid=26440B7F3D3C0BA472803E8CC9CCF2AA; access_token=FCB5074D29A743568A80EF9B2045D95D; appid=101491592; ieg_ams_token=; ieg_ams_session_token=; ieg_ams_token_time=; ieg_ams_sign=',
  },
  {
    label: '时光偏向',
    value:
      'pgv_info=ssid=s2777336064; pgv_pvid=9887510818; eas_sid=R107U4K8Y550x4p5n6U7Z7Z9J5; RK=Wv9gCUvOw9; ptcz=99df430291a7eb5f45ebd6352ace79596f94534f1cb183b29703769ac60e7036; iegams_milo_proxylogin_qc=101491592_%24%24_336206A56BCCF9199511955C102B1ADE_%24%24_F3F1BFBF2D279B05C0032F11DBB2326B; dfqqcomrouteLine=record202410ver_record202410ver; refresh_token=; expires_time=; acctype=qc; openid=336206A56BCCF9199511955C102B1ADE; access_token=F3F1BFBF2D279B05C0032F11DBB2326B; appid=101491592; ieg_ams_token=; ieg_ams_session_token=; ieg_ams_token_time=; ieg_ams_sign=',
  },
  {
    label: '神再佑我毛毛',
    value:
      'pgv_info=ssid=s6269067520; pgv_pvid=6804272000; eas_sid=b12754X8t5n0f4b8i2J9x2t293; RK=G5/k2FquR4; ptcz=ee66788ab79cbbef8c66b93807a11a02037f520180631b4105c6a2dc051ee791; iegams_milo_proxylogin_qc=101491592_%24%24_8907C2EFEC80B234F10E7D57B5A533B0_%24%24_F6DDD0A6E0A8107063C16E5205CA35B7; dfqqcomrouteLine=record202410ver_record202410ver_record202410ver_record202410ver_record202410ver_record202410ver; acctype=qc; openid=8907C2EFEC80B234F10E7D57B5A533B0; access_token=F6DDD0A6E0A8107063C16E5205CA35B7; appid=101491592; refresh_token=; ieg_ams_token=; ieg_ams_session_token=; ieg_ams_token_time=; ieg_ams_sign=; expires_time=',
  },
  { label: '自定义', value: 'custom' },
];

export { colors, agentsNameMap, seasonOptions, ckOptions };
