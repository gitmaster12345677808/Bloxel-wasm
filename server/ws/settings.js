
export const PROXY_PORT = parseInt(process.env.WS_PORT || '8888');

// [virtual_ip, real_ip, real_port]
//
// The virtual IP is the one that minetest-wasm sees.
// The virtual port is the same as the real port.
//
export const DIRECT_PROXY = [
    // This allows clients to connect to a server running on the proxy itself.
    ['192.168.0.1', '127.0.0.1', 30000 ,'Pocketboat PE' ,'welcome to a minecraft pe server everyone loves'],
    ['1.2.3.4', '127.0.0.1', 19190 ,'WoodBoat Network' ,'a Lifeboat remake for minetest'],
    ['192.168.0.2', '127.0.0.1', 30008 ,'BackToAlpha' ,'this is a minecraft alpha 1.0.17_04 remake'],
    ['3.4.6.7', '127.0.0.1', 19198 ,'Creative' ,'Creative Mode'],
    ['4.4.6.7', '127.0.0.1', 19232 ,'SkyWars' ,'a SkyWars server'],
    ['192.168.0.3', '127.0.0.1', 19199 ,'EriksKingdom' ,'this is a server ruled by a player named erik also hope you all enjoy'],
    ['0.4.0.4', '127.0.0.1', 51337 ,'Minetest Alpha v0.2.3' ,'You Will See Soon......'],
    ['2.4.2.5', '127.0.0.1', 19231 ,'WebCraft Alpha' ,'alpha game for webcraft'],
    ['2.4.6.7', '127.0.0.1', 19276 ,'SourceBoatNetwork' ,'a SkyWars server'],
    ['2.4.6.35', '127.0.0.1', 22234 ,'capturetheflag' ,'a capturetheflag server'],
    ['9.9.6.5', '109.123.248.145', 34454 ,'mtpe' ,'mtpe'],
    ['3.4.4.5', '109.123.248.145', 34455 ,'mtpec' ,'mtpec'],
    ['3.4.4.6', '109.123.248.145', 34456 ,'mtpec' ,'mtpec'],
    ['3.4.4.7', '109.123.248.145', 34457 ,'mtpec' ,'mtpec'],
    ['3.4.4.8', '109.123.248.145', 34458 ,'mtpec' ,'mtpec'],
    ['3.4.4.9', '109.123.248.145', 34459 ,'mtpec' ,'mtpec'],
    ['7.7.7.7', '109.123.248.145', 7777 ,'mtpec' ,'mtpec'],
    // This would allow clients to connect to 1.2.3.4, port 40000
    //['192.168.0.2', '1.2.3.4', 40000],
];
