var chat_domain = openfire_domain;//openfire主机名区分大小写,openfire控制台内的所有域名必须保持一致
var chat_SystemAdministrator = openfire_admin_account_id;//aa5cba2969c046d0af211c98641915c8//3e7f90d1f0f14f569f649231a17d1516
var chat_user_password = openfire_admin_account_pwd;
var chat_subdomain = openfire_subdomain;
var BOSH_SERVICE = 'ws://' + chat_domain + ':' + openfire_websocket_port + '/ws/';
//房间配置
var roomConfigureInfo = {
    "muc#roomconfig_publicroom": "0",
    "muc#roomconfig_persistentroom": "1",
    "muc#roomconfig_enablelogging": "1",
    "muc#roomconfig_publicroom": "1",
    "muc#roomconfig_moderatedroom": "1",
    "muc#roomconfig_maxusers": "0",
    "muc#roomconfig_membersonly": "1"
};

