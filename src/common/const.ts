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
      'pgv_pvid=4895559500; eas_sid=81i7L3v9k1T8O7K3Q4y8F213u6; pgv_info=ssid=s3810672168; dfqqcomrouteLine=record202410ver_record202410ver_record202410ver; RK=tSUQeBPr2E; ptcz=56761e84298743277c44fdc9ce6e1aaf01d848ddfba89205e806370b9d360f1e; iegams_milo_proxylogin_qc=101491592_%24%24_26440B7F3D3C0BA472803E8CC9CCF2AA_%24%24_21F4AD729C637E974124A70DFFEF70EB; acctype=qc; openid=26440B7F3D3C0BA472803E8CC9CCF2AA; access_token=21F4AD729C637E974124A70DFFEF70EB; appid=101491592; refresh_token=; ieg_ams_token=; ieg_ams_session_token=; ieg_ams_token_time=; ieg_ams_sign=; expires_time=',
  },
  { label: '自定义', value: 'custom' },
];

export { colors, agentsNameMap, seasonOptions, ckOptions };
