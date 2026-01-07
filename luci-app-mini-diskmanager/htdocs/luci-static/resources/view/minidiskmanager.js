'use strict';
'require fs';
'require ui';
'require view';
'require form';
'require rpc';
'require uci';

/*

  Copyright 2025-2026 Rafał Wabik - IceG - From eko.one.pl forum
  
  MIT License
  
*/

document.head.append(E('style', {'type': 'text/css'},
`

:root {
	--app-mini-diskmanager-primary: #2ea256;
	--app-mini-diskmanager-danger: #ff4e54;
	--app-mini-diskmanager-warning: #ff9800;
	--partition-color-ext4: rgba(144, 195, 86, 0.8);
	--partition-color-ext3: rgba(124, 179, 66, 0.8);
	--partition-color-ext2: rgba(98, 146, 55, 0.8);
	--partition-color-ntfs: rgba(61, 174, 233, 0.8);
	--partition-color-fat: rgba(246, 116, 0, 0.8);
	--partition-color-vfat: rgba(246, 116, 0, 0.8);
	--partition-color-fat32: rgba(246, 116, 0, 0.8);
	--partition-color-exfat: rgba(255, 152, 0, 0.8);
	--partition-color-swap: rgba(244, 67, 54, 0.8);
	--partition-color-extended: rgba(158, 158, 158, 0.8);
	--partition-color-primary: rgba(100, 149, 237, 0.8);
	--partition-color-logical: rgba(173, 216, 230, 0.8);
	--partition-color-f2fs: rgba(156, 39, 176, 0.8);
	--partition-color-unallocated: rgba(224, 224, 224, 0.5);
	--partition-color-free: rgba(224, 224, 224, 0.5);
	--partition-border: #cccccc;
	--active-tile-bg: #e6f4ea;
	--active-tile-border: #2e7d32;
	--border-color-medium: #e0e0e0;
	--background-color-medium: #f8f8f8;
	--text-color-primary: #222;
	--text-color-secondary: #666;
}

:root[data-darkmode="true"] {
	--app-mini-diskmanager-primary: #2ea256;
	--app-mini-diskmanager-danger: #a93734;
	--app-mini-diskmanager-warning: #f57c00;
	--partition-color-ext4: rgba(90, 138, 47, 0.8);
	--partition-color-ext3: rgba(74, 118, 36, 0.8);
	--partition-color-ext2: rgba(58, 96, 25, 0.8);
	--partition-color-ntfs: rgba(42, 125, 186, 0.8);
	--partition-color-fat: rgba(197, 88, 0, 0.8);
	--partition-color-vfat: rgba(197, 88, 0, 0.8);
	--partition-color-fat32: rgba(197, 88, 0, 0.8);
	--partition-color-exfat: rgba(230, 126, 34, 0.8);
	--partition-color-swap: rgba(198, 40, 40, 0.8);
	--partition-color-extended: rgba(97, 97, 97, 0.8);
	--partition-color-primary: rgba(65, 105, 225, 0.8);
	--partition-color-logical: rgba(100, 149, 237, 0.8);
	--partition-color-f2fs: rgba(123, 31, 162, 0.8);
	--partition-color-unallocated: rgba(66, 66, 66, 0.5);
	--partition-color-free: rgba(66, 66, 66, 0.5);
	--partition-border: #555555;
	--active-tile-bg: rgba(46, 204, 113, 0.22);
	--active-tile-border: #2ecc71;
	--border-color-medium: #444;
	--background-color-medium: rgba(255,255,255,0.03);
	--text-color-primary: #eee;
	--text-color-secondary: #ccc;
}

.controls {
	display: flex;
	margin: .5em 0 1em 0;
	flex-wrap: wrap;
	justify-content: space-around;
}

.controls > * {
	padding: .25em;
	white-space: nowrap;
	flex: 1 1 33%;
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
}

.controls > *:first-child,
.controls > * > label {
	flex-basis: 100%;
	min-width: 250px;
}

.controls > *:nth-child(2),
.controls > *:nth-child(3) {
	flex-basis: 50%;
}

.controls > * > .btn {
	flex-basis: 20px;
	text-align: center;
}

.controls > * > * {
	flex-grow: 1;
	align-self: center;
}

.controls > div > input {
	width: auto;
}

.controls .control-group {
	display: flex;
	gap: .5em;
	align-items: center;
	width: 100%;
}

.controls .control-group select {
	min-width: 50px;
	flex-grow: 1;
}

.operation-status {
	display: none;
	padding: 12px 16px;
    border: 1px solid var(--border-color-medium);
    border-radius: 5px;
	margin: 15px 0;
}

.operation-status.active {
	display: block;
}

.operation-status .spinning {
	display: inline-block;
	margin-right: 8px;
}

.disk-partition-bar {
	width: 100%;
	height: 60px;
	display: flex;
	border: 1px solid var(--partition-border);
	border-radius: 4px;
	overflow: hidden;
	margin: 15px 0;
	background: var(--partition-color-unallocated);
}

.partition-segment {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	border-right: 1px solid var(--partition-border);
	font-size: 11px;
	padding: 4px;
	text-align: center;
	overflow: hidden;
	position: relative;
	opacity: 0.85;
	box-sizing: border-box;
}

.partition-segment:last-child {
	border-right: none;
}

.partition-segment.ext4 { 
	background-color: var(--partition-color-ext4);
	color: #000;
}
.partition-segment.ext3 { 
	background-color: var(--partition-color-ext3);
	color: #000;
}
.partition-segment.ext2 { 
	background-color: var(--partition-color-ext2);
	color: #000;
}
.partition-segment.ntfs { 
	background-color: var(--partition-color-ntfs);
	color: #fff;
}
.partition-segment.vfat,
.partition-segment.fat32 { 
	background-color: var(--partition-color-fat);
	color: #fff;
}
.partition-segment.exfat { 
	background-color: var(--partition-color-exfat);
	color: #fff;
}
.partition-segment.swap { 
	background-color: var(--partition-color-swap);
	color: #fff;
}
.partition-segment.extended { 
	background-color: var(--partition-color-extended);
	color: #fff;
}
.partition-segment.primary { 
	background-color: var(--partition-color-primary);
	color: #fff;
}
.partition-segment.logical { 
	background-color: var(--partition-color-logical);
	color: #000;
}
.partition-segment.f2fs { 
	background-color: var(--partition-color-f2fs);
	color: #fff;
}
.partition-segment.free .partition-label,
.partition-segment.unallocated .partition-label,
.partition-segment.free .partition-size,
.partition-segment.unallocated .partition-size {
    background-color: var(--partition-color-unallocated);
    font-weight: 600;
}
.partition-segment.free,
.partition-segment.unallocated {
    color: #fff;
    text-shadow: 0 2px 6px rgba(0,0,0,0.7);
}

.partition-label {
	font-weight: bold;
	font-size: 13px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
	line-height: 1.3;
	text-shadow: 0 1px 3px rgba(0,0,0,0.6);
}

.partition-size {
	font-size: 12px;
	font-weight: 600;
	margin-top: 2px;
	line-height: 1.2;
	text-shadow: 0 1px 3px rgba(0,0,0,0.6);
}

.partition-color-indicator {
	display: inline-block;
	width: 18px;
	height: 18px;
	border: 2px solid;
	border-radius: 3px;
	margin-right: 8px;
	vertical-align: middle;
	opacity: 0.85;
}

.partition-color-indicator.ext4 { 
	background-color: var(--partition-color-ext4); 
	border-color: rgba(144, 195, 86, 1);
}
.partition-color-indicator.ext3 { 
	background-color: var(--partition-color-ext3); 
	border-color: rgba(124, 179, 66, 1);
}
.partition-color-indicator.ext2 { 
	background-color: var(--partition-color-ext2); 
	border-color: rgba(98, 146, 55, 1);
}
.partition-color-indicator.ntfs { 
	background-color: var(--partition-color-ntfs); 
	border-color: rgba(61, 174, 233, 1);
}
.partition-color-indicator.vfat,
.partition-color-indicator.fat32 { 
	background-color: var(--partition-color-fat); 
	border-color: rgba(246, 116, 0, 1);
}
.partition-color-indicator.exfat { 
	background-color: var(--partition-color-exfat); 
	border-color: rgba(255, 152, 0, 1);
}
.partition-color-indicator.swap { 
	background-color: var(--partition-color-swap); 
	border-color: rgba(244, 67, 54, 1);
}
.partition-color-indicator.extended { 
	background-color: var(--partition-color-extended); 
	border-color: rgba(158, 158, 158, 1);
}
.partition-color-indicator.primary { 
	background-color: var(--partition-color-primary); 
	border-color: rgba(100, 149, 237, 1);
}
.partition-color-indicator.logical { 
	background-color: var(--partition-color-logical); 
	border-color: rgba(173, 216, 230, 1);
}
.partition-color-indicator.f2fs { 
	background-color: var(--partition-color-f2fs); 
	border-color: rgba(156, 39, 176, 1);
}
.partition-color-indicator.unallocated { 
	background-color: var(--partition-color-unallocated); 
	border-color: rgba(158, 158, 158, 1);
}

.partition-inner-fs {
	display: flex;
	height: 100%;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
}

.partition-inner-segment {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 9px;
	font-weight: bold;
	color: #fff;
	border-right: 1px solid rgba(255,255,255,0.4);
	position: relative;
	overflow: hidden;
	text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.partition-inner-segment:last-child {
	border-right: none;
}

.partition-inner-segment.ext4 { 
	background-color: var(--partition-color-ext4);
}
.partition-inner-segment.ext3 { 
	background-color: var(--partition-color-ext3);
}
.partition-inner-segment.ext2 { 
	background-color: var(--partition-color-ext2);
}
.partition-inner-segment.ntfs { 
	background-color: var(--partition-color-ntfs);
}
.partition-inner-segment.vfat,
.partition-inner-segment.fat32 { 
	background-color: var(--partition-color-fat);
}
.partition-inner-segment.exfat { 
	background-color: var(--partition-color-exfat);
}
.partition-inner-segment.swap { 
	background-color: var(--partition-color-swap);
}
.partition-inner-segment.f2fs { 
	background-color: var(--partition-color-f2fs);
}
.partition-inner-segment.logical { 
	background-color: var(--partition-color-logical);
}

.partition-table-container tbody tr td:first-child {
    font-family: 'Courier New', Courier, monospace;
}

.partition-inner-segment {
    transition: all 0.2s ease;
}

tbody tr td:first-child {
    white-space: pre;
}

.size-input-group {
	display: flex;
	gap: 8px;
	align-items: center;
}

.size-input-group input[type="text"] {
	flex: 1;
	min-width: 0;
}

.size-input-group select {
	width: 80px;
	flex-shrink: 0;
}

@media (max-width: 990px) {
	.controls { gap:.4rem; }
	.controls > * { flex-basis: 100%; max-width: 100%; min-width: 0; }
}
`));

return view.extend({
    selectedDisk: null,
    selectedPartition: null,
    selectedUnallocated: null,
    diskData: {},
    mountedPartitions: {},
    deviceRegExp: new RegExp('^((h|s)d[a-z]|nvme[0-9]+n[0-9]+|mmcblk[0-9]+)$'),
    supportedFs: null,
    MIN_VISIBLE_SIZE: 200 * 1024 * 1024, // 200 MB
    wipeAllEnabled: false,
    hasDdSupport: null,
    wipeAllEnabled: false,

    getInstalledPackages: function() {
        const tryCmd = (cmd, args) => {
            return L.resolveDefault(fs.exec(cmd, args), { code: 1, stdout: '' });
        };

        return tryCmd('/usr/bin/opkg', ['list-installed'])
            .then(res => {
                if (res && res.code === 0 && res.stdout) {
                    return (res.stdout || '').trim().split('\n').map(s => s.trim()).filter(Boolean);
                }
                return tryCmd('/usr/libexec/opkg-call', ['list-installed']).then(r2 => {
                    if (r2 && r2.code === 0 && r2.stdout) return (r2.stdout || '').trim().split('\n').map(s => s.trim()).filter(Boolean);
                    return tryCmd('/usr/libexec/package-manager-call', ['list-installed']).then(r3 => {
                        if (r3 && r3.code === 0 && r3.stdout) return (r3.stdout || '').trim().split('\n').map(s => s.trim()).filter(Boolean);
                        return [];
                    });
                });
            })
            .catch(() => {
                return [];
            });
    },

    _isPackageInstalledFromList: function(installedPackages, name) {
        if (!installedPackages || !installedPackages.length) return false;
        return installedPackages.some(function(line) {
            return line.split(/\s+/)[0] === name || line.indexOf(name + ' -') === 0 || line.indexOf(name + ':') === 0 || line.indexOf(name) !== -1;
        });
    },

    detectSupportedFilesystems: async function() {
        if (this.supportedFs !== null) return this.supportedFs;

        try {
            const installed = await this.getInstalledPackages();
            const fsSet = new Set();

            const has = (name) => this._isPackageInstalledFromList(installed, name);

            if (has('e2fsprogs') && has('kmod-fs-ext4')) {
                fsSet.add('ext2');
            }
            
            if (has('e2fsprogs') && has('kmod-fs-ext4')) {
                fsSet.add('ext3');
            }
            
            if (has('e2fsprogs') && has('kmod-fs-ext4')) {
                fsSet.add('ext4');
            }

            if (has('kmod-fs-f2fs') && has('mkf2fs') && has('f2fs-tools') && has('f2fsck')) {
                fsSet.add('f2fs');
            }

            if (has('dosfstools') && has('kmod-fs-vfat')) {
                fsSet.add('vfat');
            }

            if (has('ntfs-3g') && has('kmod-fs-ntfs3') && has('ntfs-3g-utils')) {
                fsSet.add('ntfs');
            }

            if (has('exfat-mkfs') && has('kmod-fs-exfat') && has('exfat-utils')) {
                fsSet.add('exfat');
            }

	        if (has('swap-utils')) {
        		fsSet.add('swap');
	        }

            this.supportedFs = Array.from(fsSet);
            return this.supportedFs;
        } catch (e) {
            console.error('detectSupportedFilesystems error:', e);
            this.supportedFs = [];
            return this.supportedFs;
        }
    },

    checkDdSupport: async function() {
        if (this.hasDdSupport !== null) return this.hasDdSupport;

        try {
            try {
                const result = await L.resolveDefault(fs.stat('/bin/dd'), null);
                this.hasDdSupport = (result && result.type === 'file');
                
                if (this.hasDdSupport) {
                    return true;
                }
            } catch (e) {
                // None
            }
            
            const installed = await this.getInstalledPackages();
            const has = (name) => this._isPackageInstalledFromList(installed, name);
            
            this.hasDdSupport = has('coreutils') || has('coreutils-dd');
            
            return this.hasDdSupport;
        } catch (e) {
            console.error('checkDdSupport error:', e);
            this.hasDdSupport = false;
            return this.hasDdSupport;
        }
    },

    disableAllButtonsAndRemember: function() {
        try {
            const nodes = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]'));
            const prior = nodes.map(n => ({ el: n, disabled: !!n.disabled }));
            nodes.forEach(n => {
                try { n.disabled = true; } catch (e) {}
            });
            return {
                restore: function() {
                    prior.forEach(p => {
                        try { p.el.disabled = p.disabled; } catch (e) {}
                    });
                }
            };
        } catch (e) {
            console.error('disableAllButtonsAndRemember failed', e);
            return { restore: function() {} };
        }
    },

    disableActiveButtonsAndRemember: function() {
        try {
            const nodes = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]'));
            const toDisable = nodes.filter(n => !n.disabled);
            const prior = toDisable.map(n => ({ el: n, disabled: !!n.disabled }));
            toDisable.forEach(n => {
                try { n.disabled = true; } catch (e) {}
            });
            return {
                restore: function() {
                    prior.forEach(p => {
                        try { p.el.disabled = p.disabled; } catch (e) {}
                    });
                }
            };
        } catch (e) {
            console.error('disableActiveButtonsAndRemember failed', e);
            return { restore: function() {} };
        }
    },

    load: function() {
        this.checkDdSupport();
        
        return Promise.all([
            this.getBlockDevices(),
            this.getMountedPartitions(),
            L.resolveDefault(fs.stat('/usr/sbin/fdisk'), null),
            L.resolveDefault(fs.stat('/sbin/parted'), null),
        ]);
    },

    handleRender: function() {
        this.updateActionButtons();
    },

    showOperationStatus: function(message) {
        let statusBox = document.getElementById('operation-status');
        if (statusBox) {
            statusBox.innerHTML = '';
            statusBox.appendChild(E('span', {'class': 'spinning'}, message));
            statusBox.classList.add('active');
        }
    },

    hideOperationStatus: function() {
        let statusBox = document.getElementById('operation-status');
        if (statusBox) {
            statusBox.classList.remove('active');
        }
    },

    popTimeout: function(a, message, timeout, severity) {
        ui.addTimeLimitedNotification(a, message, timeout, severity);
    },

    callRpcd: function(method, params) {
        return new Promise((resolve, reject) => {
            L.resolveDefault(fs.exec('/bin/ubus', ['call', 'minidiskmanager', method, JSON.stringify(params)]))
                .then(res => {
                    if (res && res.code === 0) {
                        try {
                            const result = JSON.parse(res.stdout);
                            resolve(result);
                        } catch (e) {
                            reject(new Error(_('Failed to parse JSON response: ') + e.message));
                        }
                    } else {
                        reject(new Error(_('RPC call failed: ') + (res ? res.stderr : _('unknown error'))));
                    }
                })
                .catch(err => reject(err));
        });
    },

    monitorOperation: function(pid, progressMsg, successMsg, errorMsg) {
        return new Promise((resolve, reject) => {
            this.showOperationStatus(progressMsg);

            let checkInterval = setInterval(() => {
                this.callRpcd('check_operation', { pid: pid.toString() })
                    .then(result => {
                        if (!result.running) {
                            clearInterval(checkInterval);
                            this.hideOperationStatus();

                            if (result.exitcode === 0) {
                                this.popTimeout(null, E('p', successMsg), 5000, 'info');
                                resolve(result);
                            } else {
                                let shortError = errorMsg + ', ' + _('more info in log');
                                ui.addNotification(null, E('p', shortError), 'error');
                                console.error('Operation log:', result.log);
                                reject(new Error(shortError));
                            }
                        }
                    })
                    .catch(err => {
                        clearInterval(checkInterval);
                        this.hideOperationStatus();
                        ui.addNotification(null, E('p', _('Failed to check operation status: ') + err.message), 'error');
                        reject(err);
                    });
            }, 2000);
        });
    },

    getMountedPartitions: function() {
        return fs.exec('/bin/mount').then(res => {
            let mounted = {};
            if (res && res.code === 0) {
                let lines = res.stdout.trim().split('\n');
                lines.forEach(line => {
                    let match = line.match(/^(\/dev\/\S+)\s+on\s+(\S+)/);
                    if (match) {
                        mounted[match[1]] = match[2];
                    }
                });
            }
            return mounted;
        }).catch(() => {
            return {};
        });
    },

    getBlockDevices: function() {
        return fs.list('/dev').then(stat => {
            let devices = [];
            stat.forEach(e => {
                let fname = e.name;
                if (this.deviceRegExp.test(fname)) {
                    devices.push(fname);
                }
            });
            return devices.sort();
        }).then(devices => {
            return Promise.all(devices.map(dev =>
                L.resolveDefault(fs.exec('/usr/bin/lsblk', ['-J', '-b', '-o', 'NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,MODEL', '/dev/' + dev]), null)
                    .then(res => {
                        if (res && res.code === 0) {
                            try {
                                let data = JSON.parse(res.stdout);
                                if (data.blockdevices && data.blockdevices[0]) {
                                    return {
                                        name: dev,
                                        path: '/dev/' + dev,
                                        size: data.blockdevices[0].size,
                                        model: data.blockdevices[0].model || '',
                                        type: data.blockdevices[0].type
                                    };
                                }
                            } catch (e) {
                                console.log('JSON parse error for ' + dev, e);
                            }
                        }
                        return { name: dev, path: '/dev/' + dev, size: 0, model: '', type: 'disk' };
                    })
            ));
        }).catch(err => {
            console.log('getBlockDevices error:', err);
            return [];
        });
    },

    getDiskModel: function(device) {
        return Promise.all([
            L.resolveDefault(fs.exec('/usr/bin/lsblk', ['-dno', 'MODEL', '/dev/' + device]), null),
            L.resolveDefault(fs.exec('/usr/sbin/smartctl', ['-i', '/dev/' + device]), null),
            L.resolveDefault(fs.read('/sys/block/' + device + '/device/model'), null)
        ]).then(results => {
            if (results[0] && results[0].code === 0 && results[0].stdout.trim()) {
                return results[0].stdout.trim();
            }
            if (results[1] && results[1].code === 0) {
                let match = results[1].stdout.match(/Model Number:\s*(.+)/i);
                if (match && match[1].trim()) return match[1].trim();
            }
            if (results[2] && results[2].code === 0) {
                let match = results[2].stdout.match(/Device Model:\s*(.+)/i) || results[2].stdout.match(/Product:\s*(.+)/i);
                if (match && match[1].trim()) return match[1].trim();
            }
            if (results[3] && results[3].trim()) {
                return results[3].trim();
            }
            return null;
        }).catch(() => null);
    },

    getDiskTemperature: function(device) {
    var devicePath = '/dev/' + device;
    var runSmart = function(args) {
        return L.resolveDefault(fs.exec('/usr/sbin/smartctl', args), null);
    };

    var attempts = [
        ['--json=c', '-A', devicePath],
        ['--json=c', '-A', '-d', 'sat', devicePath]
    ];

    var extractFromJson = function(jsonText) {
        if (!jsonText) return null;
        try {
            var obj = (typeof jsonText === 'string') ? JSON.parse(jsonText) : jsonText;

            if (obj.temperature) {
                if (typeof obj.temperature === 'number') return obj.temperature + ' °C';
                if (typeof obj.temperature === 'object' && obj.temperature.current != null)
                    return String(obj.temperature.current) + ' °C';
                if (typeof obj.temperature === 'string') {
                    var m = obj.temperature.match(/(\d{1,3})/);
                    if (m) return m[1] + ' °C';
                }
            }
            if (obj['temperature.current'] || obj['Temperature'] || obj['temp']) {
                var v = obj['temperature.current'] || obj['Temperature'] || obj['temp'];
                var mv = null;
                if (typeof v === 'number') mv = v;
                if (typeof v === 'string') {
                    var mm = String(v).match(/(\d{1,3})/);
                    if (mm) mv = mm[1];
                }
                if (mv != null) return String(mv) + ' °C';
            }

            if (obj['nvme_smart_health'] && obj['nvme_smart_health'].temperature != null) {
                return String(obj['nvme_smart_health'].temperature) + ' °C';
            }
            if (obj['nvme_smart_health']) {
                var nv = obj['nvme_smart_health'];
                if (nv.temperature != null) return String(nv.temperature) + ' °C';
            }

            if (obj.ata_smart_attributes && Array.isArray(obj.ata_smart_attributes.table)) {
                for (var i = 0; i < obj.ata_smart_attributes.table.length; i++) {
                    var attr = obj.ata_smart_attributes.table[i];
                    if (!attr) continue;
                    if (attr.id === 194 || (attr.name && /temp/i.test(attr.name))) {
                        if (attr.raw) {
                            if (typeof attr.raw === 'object' && attr.raw.value != null) return String(attr.raw.value) + ' °C';
                            if (typeof attr.raw === 'string') {
                                var mm = attr.raw.match(/(\d{1,3})/);
                                if (mm) return mm[1] + ' °C';
                            }
                        }
                        if (attr.value != null) return String(attr.value) + ' °C';
                        if (attr.raw && attr.raw['value'] != null) return String(attr.raw['value']) + ' °C';
                    }
                }
            }

            if (obj.smart_status && obj.smart_status.temperature != null) {
                return String(obj.smart_status.temperature) + ' °C';
            }

            var txt = JSON.stringify(obj);
            var m = txt.match(/"temperature"\s*[:=]\s*(\d{1,3})/i) ||
                    txt.match(/"temp"\s*[:=]\s*(\d{1,3})/i) ||
                    txt.match(/\bTemperature\b[^0-9\n\r]{0,6}[:=]?\s*(\d{1,3})/i);
            if (m && m[1]) return m[1] + ' °C';
        } catch (e) {
            // return null
            return null;
        }
        return null;
    };

    var sequence = Promise.resolve(null);
    for (var ai = 0; ai < attempts.length; ai++) {
        (function(args) {
            sequence = sequence.then(function(found) {
                if (found) return found;
                return runSmart(args).then(function(res) {
                    if (!res || res.code !== 0) return null;

                    var fromJson = extractFromJson(res.stdout);
                    if (fromJson) return fromJson;

                    var out = res.stdout || '';
                    var rx1 = out.match(/(?:Current Drive Temperature|Temperature|Drive Temperature|Temp)[^\\d\\n\\r]{0,6}([0-9]{1,3})/i);
                    if (rx1 && rx1[1]) return rx1[1] + ' °C';

                    var rx2 = out.match(/([0-9]{1,3})\s*°\s*C/i);
                    if (rx2 && rx2[1]) return rx2[1] + ' °C';

                    var rx3 = out.match(/:?\s*([\d]{1,3})\s+C\b/);
                    if (rx3 && rx3[1]) return rx3[1] + ' °C';

                    return null;
                }).catch(function() { return null; });
            });
        })(attempts[ai]);
    }

    return sequence.catch(function() { return null; });
},

    getSmartStatus: function(device) {
        return L.resolveDefault(fs.exec('/usr/sbin/smartctl', ['-H', '/dev/' + device]), null)
            .then(res => {
                if (res && res.code === 0) {
                    if (res.stdout.match(/PASSED/i)) {
                        return { status: _('PASSED'), color: 'var(--app-mini-diskmanager-primary)' };
                    } else if (res.stdout.match(/FAILED/i)) {
                        return { status: _('FAILED'), color: 'var(--app-mini-diskmanager-danger)' };
                    }
                }
                return { status: '-', color: 'var(--text-color-secondary)' };
            }).catch(() => ({ status: '-', color: 'var(--text-color-secondary)' }));
    },

    getDiskInfo: function(device) {
        let devicePath = '/dev/' + device;
        return Promise.all([
            L.resolveDefault(fs.exec('/usr/sbin/fdisk', ['-l', devicePath]), null),
            L.resolveDefault(fs.exec('/sbin/parted', [devicePath, 'unit', 'B', 'print', 'free']), null),
            L.resolveDefault(fs.exec('/usr/bin/lsblk', ['-J', '-b', '-o', 'NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,LABEL,UUID,PARTTYPENAME', devicePath]), null),
            this.getDiskModel(device),
            this.getDiskTemperature(device),
            this.getSmartStatus(device),
            L.resolveDefault(fs.exec('/bin/df', ['-B1']), null)
        ]).then(results => {
            let diskInfo = {
                device: device,
                fdisk: (results[0] && results[0].code === 0) ? results[0].stdout : null,
                parted: (results[1] && results[1].code === 0) ? results[1].stdout : null,
                lsblk: null,
                partitions: [],
                model: results[3] || null,
                temperature: results[4] || null,
                smartStatus: results[5] || { status: 'N/A', color: 'var(--text-color-secondary)' },
                hasPartitionTable: false
            };

            let dfData = {};
            if (results[6] && results[6].code === 0) {
                let dfLines = results[6].stdout.trim().split('\n');
                dfLines.slice(1).forEach(line => {
                    let parts = line.trim().split(/\s+/);
                    if (parts.length >= 6 && parts[0].startsWith('/dev/')) {
                        dfData[parts[0]] = {
                            size: parseInt(parts[1]) || 0,
                            used: parseInt(parts[2]) || 0,
                            available: parseInt(parts[3]) || 0,
                            usePercent: parts[4],
                            mountpoint: parts[5]
                        };
                    }
                });
            }

            if (results[1] && results[1].code === 0) {
                diskInfo.hasPartitionTable = results[1].stdout.indexOf('Partition Table:') !== -1 &&
                                            results[1].stdout.indexOf('unknown') === -1;
            }

            if (results[2] && results[2].code === 0) {
                try {
                    let data = JSON.parse(results[2].stdout);
                    if (data.blockdevices && data.blockdevices[0]) {
                        diskInfo.lsblk = data.blockdevices[0];
                        diskInfo.size = data.blockdevices[0].size || 0;
                        if (diskInfo.lsblk.children) {
                            diskInfo.partitions = diskInfo.lsblk.children.map(part => {
                                let partPath = '/dev/' + part.name;
                                if (dfData[partPath]) {
                                    part.used = dfData[partPath].used;
                                    part.available = dfData[partPath].available;
                                }
                                return part;
                            });
                        }
                    }
                } catch (e) {
                    console.log('lsblk JSON parse error:', e);
                }
            }

            return diskInfo;
        }).catch(err => {
            console.log('getDiskInfo error:', err);
            throw err;
        });
    },

    parsePartedOutput: function(output) {
        let lines = (output || '').split('\n');
        let partitions = [];
        let inPartitionTable = false;
        let diskSize = 0;
        let hasTypeColumn = false;
        let freeCounter = 1;

        const parseSize = function(sizeStr) {
            if (!sizeStr) return 0;
            let match = sizeStr.match(/([\d.]+)([KMGTB]*)/i);
            if (!match) return 0;
            let value = parseFloat(match[1]);
            let unit = match[2].toUpperCase();
            
            switch(unit) {
                case 'KB': return Math.floor(value * 1024);
                case 'MB': return Math.floor(value * 1024 * 1024);
                case 'GB': return Math.floor(value * 1024 * 1024 * 1024);
                case 'TB': return Math.floor(value * 1024 * 1024 * 1024 * 1024);
                case 'B':
                default: return Math.floor(value);
            }
        };

        for (let line of lines) {
            if (line.includes('Disk /dev/')) {
                let match = line.match(/:\s*([\d.]+)([KMGTB]*)/i);
                if (match) diskSize = parseSize(match[1] + match[2]);
            }

            if (line.match(/^\s*Number/) && line.toLowerCase().includes('type')) {
                hasTypeColumn = true;
                inPartitionTable = true;
                continue;
            }

            if (line.match(/^\s*Number/)) {
                inPartitionTable = true;
                continue;
            }

            if (inPartitionTable && line.trim()) {
                let parts = line.trim().split(/\s+/);
                
                if (parts.length >= 3 && !/^\d+$/.test(parts[0]) && parts[0].match(/^\d+/)) {
                    let partition = {
                        number: 'free' + freeCounter++,
                        start: parseSize(parts[0]),
                        end: parseSize(parts[1]),
                        size: parseSize(parts[2]),
                        type: 'free',
                        filesystem: 'free',
                        flags: ''
                    };
                    partitions.push(partition);
                    continue;
                }
                
                if (parts.length >= 4) {
                    let number = parts[0];
                    if (!/^\d+$/.test(number)) {
                        continue;
                    }

                    let partition = {
                        number: number,
                        start: parseSize(parts[1]),
                        end: parseSize(parts[2]),
                        size: parseSize(parts[3]),
                        type: 'primary',
                        filesystem: '',
                        flags: ''
                    };

                    if (hasTypeColumn && parts.length >= 5) {
                        partition.type = parts[4].toLowerCase();
                        partition.filesystem = parts[5] || '';
                        partition.flags = parts.slice(6).join(' ');
                    } else if (parts.length >= 5) {
                        partition.filesystem = parts[4] || '';
                        partition.flags = parts.slice(5).join(' ');
                    }
                    if (partition.type === 'extended' && !partition.filesystem) {
                        partition.filesystem = 'extended';
                    }

                    partitions.push(partition);
                }
            }
        }

        return { diskSize, partitions };
    },

    normalizeFsClass: function(fstypeRaw) {
        if (!fstypeRaw) return 'unallocated';
        let fs = (fstypeRaw || '').toString().toLowerCase().trim();
        if (fs === 'fat32' || fs === 'fat') fs = 'vfat';
        if (fs === 'linux-swap' || fs === 'swap') fs = 'swap';
        if (fs === 'extended') fs = 'extended';
        if (fs === 'space' || fs === 'free') fs = 'unallocated';
        if (fs === '') fs = 'unallocated';
        fs = fs.replace(/[^a-z0-9]/g, '');
        if (!fs) fs = 'unallocated';
        return fs;
    },

    getFriendlyFsName: function(fstype) {
        if (!fstype) return '-';
        let fs = this.normalizeFsClass(fstype);
        
        const friendlyNames = {
            'ext2': 'Ext2',
            'ext3': 'Ext3',
            'ext4': 'Ext4',
            'ntfs': 'NTFS',
            'vfat': 'FAT32',
            'exfat': 'exFAT',
            'swap': 'Swap',
            'f2fs': 'F2FS',
            'extended': 'Extended',
            'unallocated': 'Unallocated'
        };
        
        return friendlyNames[fs] || fs.toUpperCase();
    },

    getPartitionPath: function(diskDevice, partNumber) {
        if (!diskDevice) return null;
        if (diskDevice.match(/^nvme[0-9]+n[0-9]+$/)) {
            return '/dev/' + diskDevice + 'p' + partNumber;
        }
        if (diskDevice.match(/^mmcblk[0-9]+$/)) {
            return '/dev/' + diskDevice + 'p' + partNumber;
        }
        return '/dev/' + diskDevice + partNumber;
    },

    waitForDevice: function(path, maxAttempts, delayMs) {
        maxAttempts = maxAttempts || 10;
        delayMs = delayMs || 500;
        return new Promise((resolve) => {
            let attempts = 0;
            let check = () => {
                fs.stat(path).then(() => resolve(true)).catch(() => {
                    attempts++;
                    if (attempts >= maxAttempts) resolve(false);
                    else setTimeout(check, delayMs);
                });
            };
            check();
        });
    },

    getPartitionColor: function(type) {
        const colorMap = {
            'ext4': 'rgba(144, 195, 86, 0.8)',
            'ext3': 'rgba(124, 179, 66, 0.8)',
            'ext2': 'rgba(98, 146, 55, 0.8)',
            'ntfs': 'rgba(61, 174, 233, 0.8)',
            'vfat': 'rgba(246, 116, 0, 0.8)',
            'fat32': 'rgba(246, 116, 0, 0.8)',
            'exfat': 'rgba(255, 152, 0, 0.8)',
            'swap': 'rgba(244, 67, 54, 0.8)',
            'f2fs': 'rgba(156, 39, 176, 0.8)',
            'extended': 'rgba(158, 158, 158, 0.8)',
            'primary': 'rgba(100, 149, 237, 0.8)',
            'logical': 'rgba(173, 216, 230, 0.8)',
            'unallocated': 'rgba(224, 224, 224, 0.5)',
            'free': 'rgba(224, 224, 224, 0.5)'
        };

        const isDarkMode = document.documentElement.getAttribute('data-darkmode') === 'true';

        if (isDarkMode) {
            const darkColorMap = {
                'ext4': 'rgba(90, 138, 47, 0.8)',
                'ext3': 'rgba(74, 118, 36, 0.8)',
                'ext2': 'rgba(58, 96, 25, 0.8)',
                'ntfs': 'rgba(42, 125, 186, 0.8)',
                'vfat': 'rgba(197, 88, 0, 0.8)',
                'fat32': 'rgba(197, 88, 0, 0.8)',
                'exfat': 'rgba(230, 126, 34, 0.8)',
                'swap': 'rgba(198, 40, 40, 0.8)',
                'f2fs': 'rgba(123, 31, 162, 0.8)',
                'extended': 'rgba(97, 97, 97, 0.8)',
                'primary': 'rgba(65, 105, 225, 0.8)',
                'logical': 'rgba(100, 149, 237, 0.8)',
                'unallocated': 'rgba(66, 66, 66, 0.5)',
                'free': 'rgba(66, 66, 66, 0.5)'
            };
            return darkColorMap[type] || 'transparent';
        }

        return colorMap[type] || 'transparent';
    },

    getPartitionType: function(part, diskInfo) {
        if (!part || !diskInfo) return 'primary';

        if (diskInfo.parted) {
            let partNum = part.name.match(/\d+$/);
            if (partNum) {
                let parsed = this.parsePartedOutput(diskInfo.parted);
                let partedInfo = parsed.partitions.find(p => p.number === partNum[0]);
                if (partedInfo && partedInfo.type) {
                    return partedInfo.type;
                }
                if (partedInfo && partedInfo.filesystem === 'extended') {
                    return 'extended';
                }
            }
        }

        let partTypeClass = 'primary';
        if (part.parttypename) {
            let t = (part.parttypename || '').toLowerCase();
            if (t.indexOf('extended') !== -1) partTypeClass = 'extended';
            else if (t.indexOf('logical') !== -1) partTypeClass = 'logical';
            else partTypeClass = 'primary';
        }

        let partNum = part.name.match(/\d+$/);
        if (partTypeClass === 'primary' && partNum && parseInt(partNum[0]) >= 5) {
            partTypeClass = 'logical';
        }

        return partTypeClass;
    },

    isDiskMounted: function(diskDevice) {
        if (!diskDevice || !this.diskData[diskDevice]) return false;
        let diskInfo = this.diskData[diskDevice];
        if (!diskInfo.partitions) return false;
        for (let part of diskInfo.partitions) {
            if (part.mountpoint && part.mountpoint !== '') {
                return true;
            }
        }
        return false;
    },

    isPartitionMounted: function(partition) {
        if (!partition) return false;
        return partition.mountpoint && partition.mountpoint !== '';
    },

    hasAnyPartitionMounted: function(diskDevice) {
        if (!diskDevice || !this.diskData[diskDevice]) return false;
        let diskInfo = this.diskData[diskDevice];
        if (!diskInfo.partitions) return false;
        for (let part of diskInfo.partitions) {
            if (part.mountpoint && part.mountpoint !== '') {
                return true;
            }
        }
        return false;
    },

    getAvailableSpaceForResize: function(partition) {
        if (!partition || !this.selectedDisk) return 0;
        
        let diskInfo = this.diskData[this.selectedDisk];
        if (!diskInfo || !diskInfo.parted) return 0;

        let parsed = this.parsePartedOutput(diskInfo.parted);
        let partNum = partition.name.match(/\d+$/);
        if (!partNum) return 0;

        let currentPart = parsed.partitions.find(p => p.number === partNum[0]);
        if (!currentPart) return 0;

        const SECTOR_ALIGNMENT_TOLERANCE = 1048576;

        for (let part of parsed.partitions) {
            let ptype = (part.type || '').toLowerCase();
            let fs = (part.filesystem || '').toLowerCase();
            
            if (ptype === 'extended' || fs === 'extended') {
                continue;
            }
            
            if (ptype === 'free' || fs === 'free' || fs === '' || fs === 'unallocated') {
                let distance = part.start - currentPart.end;
                if (distance >= 0 && distance <= SECTOR_ALIGNMENT_TOLERANCE) {
                    return part.size;
                }
            }
        }

        return 0;
    },

    canResizePartition: function(partition) {
        if (!partition) return false;
        
        let fstype = this.normalizeFsClass(partition.fstype);
        if (fstype !== 'ext2' && fstype !== 'ext3' && fstype !== 'ext4') {
            return false;
        }

        if (this.isPartitionMounted(partition)) {
            return false;
        }

        let availableSpace = this.getAvailableSpaceForResize(partition);
        const MIN_RESIZE_SPACE = 10 * 1024 * 1024; // 10MB minimum
        
        if (availableSpace < MIN_RESIZE_SPACE) {
            return false;
        }

        let diskInfo = this.diskData[this.selectedDisk];
        if (!diskInfo || !diskInfo.parted) return false;

        let parsed = this.parsePartedOutput(diskInfo.parted);
        let partNum = partition.name.match(/\d+$/);
        if (!partNum) return false;

        let currentPart = parsed.partitions.find(p => p.number === partNum[0]);
        if (!currentPart) return false;

        for (let part of parsed.partitions) {
            let ptype = (part.type || '').toLowerCase();
            let fs = (part.filesystem || '').toLowerCase();
            
            if (ptype === 'free' || fs === 'free' || fs === '' || fs === 'unallocated') {
                continue;
            }
            
            if (part.start > currentPart.end) {
                return false;
            }
        }

        return true;
    },

    getLogicalPartitionsInExtended: function(diskInfo, extendedPartNumber) {
        if (!diskInfo.partitions) return [];
        let logical = diskInfo.partitions.filter(p => {
            let partTypeClass = this.getPartitionType(p, diskInfo);
            let partNum = p.name.match(/\d+$/);
            if (!partNum) return false;
            let num = parseInt(partNum[0]);
            return partTypeClass === 'logical' && num > parseInt(extendedPartNumber);
        });

        logical.sort((a, b) => {
            let aNum = parseInt(a.name.match(/\d+$/)[0]);
            let bNum = parseInt(b.name.match(/\d+$/)[0]);
            return aNum - bNum;
        });

        return logical;
    },

    getTotalUnallocatedSpace: function(diskInfo) {
        let totalDiskSize = 0;
        if (diskInfo.lsblk && diskInfo.lsblk.size) {
            totalDiskSize = diskInfo.lsblk.size;
        } else if (diskInfo.parted) {
            let parsed = this.parsePartedOutput(diskInfo.parted);
            totalDiskSize = parsed.diskSize || 0;
        }

        if (totalDiskSize === 0) return 0;

        if (!diskInfo.hasPartitionTable) {
            return totalDiskSize;
        }

        let usedSpace = 0;
        if (diskInfo.partitions && diskInfo.partitions.length > 0) {
            diskInfo.partitions.forEach(part => {
                if (part.size) {
                    usedSpace += part.size;
                }
            });
        }

        if (usedSpace === 0 && diskInfo.parted) {
            let parsed = this.parsePartedOutput(diskInfo.parted);
            parsed.partitions.forEach(part => {
                let fsType = (part.filesystem || '').toLowerCase();
                if (fsType !== 'free' && fsType !== 'space' && 
                    fsType !== 'unallocated' && fsType !== '') {
                    usedSpace += part.size;
                }
            });
        }

        let reservedSpace = 1024 * 1024;
        let freeSpace = totalDiskSize - usedSpace - reservedSpace;

        return Math.max(0, freeSpace);
    },

    render: function(data) {
        let devices = data[0] || [];
        this.mountedPartitions = data[1] || {};

        let diskSelect = E('select', {
            'class': 'cbi-input-select',
            'style': 'max-width: 400px;',
            'change': ui.createHandlerFn(this, function(ev) {
                this.selectedDisk = ev.target.value;
                this.selectedPartition = null;
                this.selectedUnallocated = null;
                this.refreshDiskView();
            })
        }, [E('option', {'value': ''}, _('-- ' + _('Select a disk') + ' --'))]);

        devices.forEach(dev => {
            let sizeStr = dev.size ? ' - ' + this.formatSize(dev.size) : '';
            let modelStr = dev.model ? ' (' + dev.model.trim() + ')' : '';
            diskSelect.appendChild(E('option', {'value': dev.name}, '/dev/' + dev.name + sizeStr + modelStr));
        });

        let controls = E('div', {'class': 'controls'}, [
            E('div', {}, [
                E('label', {}, _('Disk') + ':'),
                E('span', {'class': 'control-group'}, [
                    diskSelect,
                    E('button', {
                        'class': 'btn cbi-button',
                        'click': ui.createHandlerFn(this, this.refreshDiskView)
                    }, _('Refresh'))
                ])
            ]),
            E('div', {}, [
                E('label', {}, _('Mounting actions') + ':'),
                E('span', {'class': 'control-group'}, [
                    E('button', {
                        'id': 'btn-mount',
                        'class': 'btn',
                        'click': ui.createHandlerFn(this, this.mountDisk),
                        'disabled': 'disabled'
                    }, _('Mount')),
                    E('button', {
                        'id': 'btn-unmount',
                        'class': 'btn cbi-button-negative',
                        'click': ui.createHandlerFn(this, this.unmountDisk),
                        'disabled': 'disabled'
                    }, _('Unmount'))
                ])
            ]),
            E('div', {}, [
                E('label', {}, _('Actions on partitions') + ':'),
                E('span', {'class': 'control-group'}, [
                    E('button', {
                        'id': 'btn-create',
                        'class': 'btn cbi-button-positive',
                        'click': ui.createHandlerFn(this, this.showCreatePartitionDialog),
                        'disabled': 'disabled'
                    }, _('Create')),
                    E('button', {
                        'id': 'btn-resize',
                        'class': 'btn cbi-button-action',
                        'click': ui.createHandlerFn(this, this.showResizeDialog),
                        'disabled': 'disabled'
                    }, _('Expand')),
                    E('button', {
                        'id': 'btn-delete',
                        'class': 'btn cbi-button-negative',
                        'click': ui.createHandlerFn(this, this.showDeleteDialog),
                        'disabled': 'disabled'
                    }, _('Delete')),
                    E('button', {
                        'id': 'btn-format',
                        'class': 'cbi-button cbi-button-negative important',
                        'click': ui.createHandlerFn(this, this.showFormatDialog),
                        'disabled': 'disabled'
                    }, _('Format')),
                    E('button', {
                        'id': 'btn-wipe',
                        'class': 'cbi-button cbi-button-action important',
                        'click': ui.createHandlerFn(this, this.showWipeDialog),
                        'disabled': 'disabled'
                    }, _('Wipe'))
                ])
            ])
        ]);

        let contentArea = E('div', {'id': 'disk-content-area'}, [
            E('div', {'class': 'alert alert-info'}, _('Please select a disk to view its partitions'))
        ]);

        return E([
            E('h2', {'class': 'fade-in'}, _('Disk Manager')),
            E('div', {'class': 'cbi-section fade-in'}, [
                E('div', {'class': 'cbi-section-descr'}, 
                    _('The Mini Disk Manager package allows users to easily manage disks and partitions.')),
                controls,
                E('div', {'id': 'operation-status', 'class': 'operation-status'}),
                contentArea
            ])
        ]);
    },

    renderPartitionBar: function(diskInfo) {
        if (!diskInfo.hasPartitionTable || !diskInfo.parted) {
            let diskSize = diskInfo.lsblk ? diskInfo.lsblk.size : 0;

            let barContainer = E('div', {'class': 'disk-partition-bar'});

            let segment = E('div', {
                'class': 'partition-segment unallocated',
                'style': 'width: 100%; position: relative;',
                'data-partition-index': 0,
                'data-is-unallocated': 'true',
                'data-partition-size': diskSize,
                'data-partition-start': 0,
                'data-partition-end': diskSize
            });

            segment.addEventListener('click', (ev) => {
                const alreadySelected = segment.classList.contains('selected');
                document.querySelectorAll('.partition-segment').forEach(s => s.classList.remove('selected'));

                if (alreadySelected) {
                    this.selectedUnallocated = null;
                } else {
                    segment.classList.add('selected');
                    this.selectedUnallocated = {
                        size: diskSize,
                        start: 0,
                        end: diskSize,
                        index: 0
                    };
                }
                this.selectedPartition = null;
                this.updateActionButtons();
            }, false);

            segment.appendChild(E('div', {'class': 'partition-label'}, _('Area without partition table')));
            segment.appendChild(E('div', {'class': 'partition-size'}, this.formatSize(diskSize)));

            barContainer.appendChild(segment);

            let legendRow = [
                E('td', {
                    'class': 'td top',
                    'style': `
                        padding:4px 8px;
                        text-align:center;
                        vertical-align:middle;
                        white-space:nowrap;
                    `
                }, [
                    E('strong', {
                        'style': `
                            display:inline-block;
                            position:relative;
                            padding-bottom:2px;
                            font-weight:600;
                            font-size:12px;
                            line-height:1.2;
                        `
                    }, [
                        E('span', {
                            'style': `
                                position:relative;
                                z-index:2;
                            `
                        }, [_('Unallocated')]),
                        E('span', {
                            'style': `
                                position:absolute;
                                left:0;
                                right:0;
                                margin:auto;
                                bottom:0;
                                width:calc(100%);
                                height:2px;
                                max-width:90%;
                                background-color:${this.getPartitionColor('unallocated')};
                                border-radius:1px;
                            `
                        })
                    ])
                ])
            ];

            let legendTable = E('table', {
                'class': 'table',
                'style': `
                    width:auto;
                    margin:0 auto;
                    margin-top:12px;
                    border-collapse:collapse;
                    table-layout:auto;
                `
            }, [E('tr', {'class': 'tr'}, legendRow)]);

            let legend = E('div', {
                'style': `
                    margin-top:15px;
                    text-align:center;
                    font-size:12px;
                    color:var(--text-color-secondary);
                `
            }, [legendTable]);

            return E('div', {}, [barContainer, legend]);
        }

        let parsed = this.parsePartedOutput(diskInfo.parted);
        let diskSize = parsed.diskSize;
        let partitions = parsed.partitions;

        if (!diskSize || partitions.length === 0) {
            let totalSize = diskInfo.lsblk ? diskInfo.lsblk.size : 0;

            let barContainer = E('div', {'class': 'disk-partition-bar'});

            let segment = E('div', {
                'class': 'partition-segment unallocated',
                'style': 'width: 100%; position: relative;',
                'data-partition-index': 0,
                'data-is-unallocated': 'true',
                'data-partition-size': totalSize,
                'data-partition-start': 0,
                'data-partition-end': totalSize
            });

            segment.addEventListener('click', (ev) => {
                const alreadySelected = segment.classList.contains('selected');
                document.querySelectorAll('.partition-segment').forEach(s => s.classList.remove('selected'));

                if (alreadySelected) {
                    this.selectedUnallocated = null;
                } else {
                    segment.classList.add('selected');
                    this.selectedUnallocated = {
                        size: totalSize,
                        start: 0,
                        end: totalSize,
                        index: 0
                    };
                }
                this.selectedPartition = null;
                this.updateActionButtons();
            }, false);

            segment.appendChild(E('div', {'class': 'partition-label'}, _('Area without partition table')));
            segment.appendChild(E('div', {'class': 'partition-size'}, this.formatSize(totalSize)));

            barContainer.appendChild(segment);

            let legendRow = [
                E('td', {
                    'class': 'td top',
                    'style': `
                        padding:4px 8px;
                        text-align:center;
                        vertical-align:middle;
                        white-space:nowrap;
                    `
                }, [
                    E('strong', {
                        'style': `
                            display:inline-block;
                            position:relative;
                            padding-bottom:2px;
                            font-weight:600;
                            font-size:12px;
                            line-height:1.2;
                        `
                    }, [
                        E('span', {
                            'style': `
                                position:relative;
                                z-index:2;
                            `
                        }, [_('Unallocated')]),
                        E('span', {
                            'style': `
                                position:absolute;
                                left:0;
                                right:0;
                                margin:auto;
                                bottom:0;
                                width:calc(100%);
                                height:2px;
                                max-width:90%;
                                background-color:${this.getPartitionColor('unallocated')};
                                border-radius:1px;
                            `
                        })
                    ])
                ])
            ];

            let legendTable = E('table', {
                'class': 'table',
                'style': `
                    width:auto;
                    margin:0 auto;
                    margin-top:12px;
                    border-collapse:collapse;
                    table-layout:auto;
                `
            }, [E('tr', {'class': 'tr'}, legendRow)]);

            let legend = E('div', {
                'style': `
                    margin-top:15px;
                    text-align:center;
                    font-size:12px;
                    color:var(--text-color-secondary);
                `
            }, [legendTable]);

            return E('div', {}, [barContainer, legend]);
        }

        let barContainer = E('div', {'class': 'disk-partition-bar'});
        let usedTypes = new Set();

        for (let i = 0; i < partitions.length; i++) {
            let part = partitions[i];
            let percentage = diskSize > 0 ? (part.size / diskSize * 100) : 0;
            percentage = Math.max(0.1, percentage);

            let fsTypeRaw = part.filesystem ? part.filesystem.toLowerCase() : 'unallocated';
            let fsType = this.normalizeFsClass(fsTypeRaw);
            let isUnallocated = fsType === 'unallocated' || fsTypeRaw === 'free';

            // Hide < 200 MB
            if (isUnallocated && part.size < this.MIN_VISIBLE_SIZE) {
                continue;
            }

            let partTypeClass = 'primary';
            let displayFsType = fsType;
            let isExtended = false;
            let actualFsType = null;
            let isLogical = false;

            if (diskInfo.partitions) {
                let matchingPart = diskInfo.partitions.find(p => {
                    let partNum = p.name.match(/\d+$/);
                    return partNum && partNum[0] === part.number;
                });
                if (matchingPart) {
                    partTypeClass = this.getPartitionType(matchingPart, diskInfo);
                    actualFsType = matchingPart.fstype ? this.normalizeFsClass(matchingPart.fstype) : null;

                    isLogical = partTypeClass === 'logical';

                    if (fsType === 'extended' || partTypeClass === 'extended') {
                        partTypeClass = 'extended';
                        displayFsType = 'extended';
                        isExtended = true;
                    } else if (matchingPart.fstype) {
                        displayFsType = this.normalizeFsClass(matchingPart.fstype);
                    }
                }
            } else if (part.type === 'logical') {
                isLogical = true;
            }

            if (isLogical) {
                continue;
            }

            if (isUnallocated && (part.type === 'free' || part.filesystem === 'free')) {
                let isInsideExtended = false;
                for (let extPart of parsed.partitions) {
                    if ((extPart.type === 'extended' || extPart.filesystem === 'extended') &&
                        part.start >= extPart.start && part.end <= extPart.end) {
                        isInsideExtended = true;
                        break;
                    }
                }
                if (isInsideExtended) {
                    continue;
                }
            }

            let outerColorClass = isUnallocated ? 'unallocated' : partTypeClass;
            if (!isUnallocated) {
                usedTypes.add(partTypeClass);
                if (actualFsType && actualFsType !== 'unallocated') {
                    usedTypes.add(actualFsType);
                }
            } else {
                usedTypes.add('unallocated');
            }

            let partitionLabel = isUnallocated ? 
                _('Free Space') : 
                this.getPartitionPath(diskInfo.device, part.number);

            let segment = E('div', {
                'class': 'partition-segment ' + outerColorClass,
                'style': 'width: ' + percentage.toFixed(2) + '%; position: relative;',
                'data-partition-index': i,
                'data-partition-number': part.number,
                'data-is-unallocated': isUnallocated ? 'true' : 'false',
                'data-partition-size': part.size,
                'data-partition-start': part.start,
                'data-partition-end': part.end
            });

            // Magic 8%
            if (percentage < 8) {
                segment.setAttribute('title', partitionLabel + ' — ' + this.formatSize(part.size));
                barContainer.appendChild(segment);
                continue;
            }

            if (isExtended) {
                let logicalParts = this.getLogicalPartitionsInExtended(diskInfo, part.number);
                if (logicalParts.length > 0) {
                    logicalParts.sort((a, b) => {
                        let aNum = parseInt(a.name.match(/\d+$/)[0]);
                        let bNum = parseInt(b.name.match(/\d+$/)[0]);
                        return aNum - bNum;
                    });

                    let innerContainer = E('div', {
                        'class': 'partition-inner-fs',
                        'style': 'position: absolute; top: 2px; left: 2px; right: 2px; bottom: 2px; width: calc(100% - 4px); height: calc(100% - 4px); display: flex; z-index: 1;'
                    });

                    let totalExtendedSize = part.size;
                    let usedLogicalSize = 0;

                    logicalParts.forEach(lp => {
                        usedLogicalSize += (lp.size || 0);
                    });

                    logicalParts.forEach((lp, idx) => {
                        let lpFsType = this.normalizeFsClass(lp.fstype);
                        let lpPercentage = totalExtendedSize > 0 ? ((lp.size || 0) / totalExtendedSize * 100) : 0;
                        lpPercentage = Math.max(1, lpPercentage);
                        let lpColorClass = lpFsType && lpFsType !== 'unallocated' ? lpFsType : 'logical';

                        let innerSegment = E('div', {
                            'class': 'partition-inner-segment ' + lpColorClass,
                            'style': `
                                width: ${lpPercentage.toFixed(2)}%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                border-right: 1px solid rgba(255,255,255,0.4);
                                font-size: 9px;
                                font-weight: bold;
                                color: #fff;
                                text-shadow: 0 1px 3px rgba(0,0,0,0.6);
                                position: relative;
                                overflow: hidden;
                                border-radius: 2px;
                            `
                        });
                        // Magic 8%
                        if (lpPercentage < 8) {
                            innerSegment.setAttribute('title', '/dev/' + lp.name + ' — ' + this.formatSize(lp.size));
                        } else {
                            innerSegment.appendChild(E('div', {
                                'style': 'font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90%;'
                            }, '/dev/' + lp.name));
                            if (lpFsType && lpFsType !== 'unallocated') {
                                innerSegment.appendChild(E('div', {
                                    'style': 'font-size: 9px; margin-top: 2px; text-transform: uppercase;'
                                }, lpFsType));
                            }
                            innerSegment.appendChild(E('div', {
                                'style': 'font-size: 10px; margin-top: 2px; opacity: 0.9;'
                            }, this.formatSize(lp.size)));
                        }
                        innerContainer.appendChild(innerSegment);

                        if (lpFsType && lpFsType !== 'unallocated') {
                            usedTypes.add(lpFsType);
                        }
                    });

                    let freeInExtended = totalExtendedSize - usedLogicalSize;
                    let freePercentage = totalExtendedSize > 0 ? (freeInExtended / totalExtendedSize * 100) : 0;

                    if (freePercentage >= 8) {
                        let freeSegment = E('div', {
                            'class': 'partition-inner-segment unallocated',
                            'style': `
                                width: ${freePercentage.toFixed(2)}%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                font-size: 10px;
                                color: #fff;
                                background-color: var(--partition-color-free);
                                text-shadow: 0 1px 3px rgba(0,0,0,0.6);
                            `
                        });
                        freeSegment.appendChild(E('div', {'style': 'font-size: 9px; opacity: 0.85;'}, partitionLabel));
                        freeSegment.appendChild(E('div', {'style': 'margin-top: 2px; font-size: 10px;'}, _('Free')));
                        freeSegment.appendChild(E('div', {'style': 'margin-top: 2px; font-weight: 600;'}, 
                            this.formatSize(freeInExtended)));
                        innerContainer.appendChild(freeSegment);
                    }

                    segment.appendChild(innerContainer);

                } else {
                    segment.appendChild(E('div', {
                        'class': 'partition-label',
                        'style': 'position: relative; z-index: 2; pointer-events: none; font-size: 10px;'
                    }, partitionLabel));
                    segment.appendChild(E('div', {
                        'class': 'partition-size',
                        'style': 'position: relative; z-index: 2; pointer-events: none; font-size: 10px;'
                    }, this.formatSize(part.size)));
                }
            } else if (!isUnallocated && actualFsType && actualFsType !== 'unallocated') {
                let fsColorClass = actualFsType;
                let innerFsBox = E('div', {
                    'class': 'partition-inner-segment ' + fsColorClass,
                    'style': `
                        position: absolute;
                        top: 3px;
                        left: 3px;
                        right: 3px;
                        bottom: 3px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        border-radius: 2px;
                        z-index: 1;
                        font-weight: bold;
                        color: #fff;
                        text-shadow: 0 1px 3px rgba(0,0,0,0.6);
                    `
                });

                innerFsBox.appendChild(E('div', {
                    'class': 'partition-label',
                    'style': 'font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90%;'
                }, partitionLabel));
                innerFsBox.appendChild(E('div', {
                    'style': 'font-size: 9px; margin-top: 2px; text-transform: uppercase;'
                }, actualFsType));
                innerFsBox.appendChild(E('div', {
                    'class': 'partition-size',
                    'style': 'font-size: 11px; margin-top: 2px; opacity: 0.9;'
                }, this.formatSize(part.size)));

                segment.appendChild(innerFsBox);
            } else {
                segment.appendChild(E('div', {'class': 'partition-label'}, partitionLabel));
                segment.appendChild(E('div', {'class': 'partition-size'}, this.formatSize(part.size)));
            }

            barContainer.appendChild(segment);
        }

        let typeLabels = {
            'primary': _('Primary'),
            'extended': _('Extended'),
            'logical': _('Logical'),
            'ext4': 'Ext4',
            'ext3': 'Ext3',
            'ext2': 'Ext2',
            'f2fs': 'F2FS',
            'ntfs': 'NTFS',
            'vfat': 'FAT32',
            'exfat': 'exFAT',
            'swap': _('Linux Swap'),
            'unallocated': _('Unallocated'),
            'free': _('Unallocated'),
            'space': _('Unallocated')
        };

        let usedTypesArr = Array.from(usedTypes);
        if (usedTypesArr.length === 0) usedTypesArr = ['unallocated'];

        let legendRow = [];
        usedTypesArr.forEach(type => {
            let label = typeLabels[type] || type;
            let tdLabel = E('td', {
                'class': 'td top',
                'style': `
                    padding:4px 8px;
                    text-align:center;
                    vertical-align:middle;
                    white-space:nowrap;
                `
            }, [
                E('strong', {
                    'style': `
                        display:inline-block;
                        position:relative;
                        padding-bottom:2px;
                        font-weight:600;
                        font-size:12px;
                        line-height:1.2;
                    `
                }, [
                    E('span', {
                        'style': `
                            position:relative;
                            z-index:2;
                        `
                    }, [label]),
                    E('span', {
                        'style': `
                            position:absolute;
                            left:0;
                            right:0;
                            margin:auto;
                            bottom:0;
                            width:calc(100%);
                            height:2px;
                            max-width:90%;
                            background-color:${this.getPartitionColor(type)};
                            border-radius:1px;
                        `
                    })
                ])
            ]);
            legendRow.push(tdLabel);
        });

        let legendTable = E('table', {
            'class': 'table',
            'style': `
                width:auto;
                margin:0 auto;
                margin-top:12px;
                border-collapse:collapse;
                table-layout:auto;
            `
        }, [E('tr', {'class': 'tr'}, legendRow)]);

        let legend = E('div', {
            'style': `
                margin-top:15px;
                text-align:center;
                font-size:12px;
                color:var(--text-color-secondary);
            `
        }, [legendTable]);

        return E('div', {}, [barContainer, legend]);
    },

    renderPartitionTable: function(diskInfo) {
        let parsed = diskInfo.parted ? this.parsePartedOutput(diskInfo.parted) : {partitions: []};

        let partitionTableTitles = [
            _('Partition'),
            _('Type / Filesystem'),
            _('Mount Point'),
            _('Label'),
            _('Size'),
            _('Used'),
            _('Unused'),
            _('Flags')
        ];

        let partitionTableId = 'partition-table-' + diskInfo.device;
        let equalWidth = (100 / partitionTableTitles.length).toFixed(2) + '%';

        let headerRowChildren = partitionTableTitles.map((t, idx) => {
            if (idx === 0) {
                return E('th', {
                    'class': 'th left',
                    'style': 'width: 180px; min-width: 180px; text-align: left; cursor: default;',
                    'click': function(ev) {
                        ev.stopPropagation();
                        ev.preventDefault();
                    }
                }, [
                    E('span', {
                        'style': 'display: inline-block;',
                        'click': function(ev) {
                            ev.stopPropagation();
                        }
                    }, [
                        E('input', {
                            'type': 'checkbox',
                            'id': 'wipeall-checkbox',
                            'title': _('Select all partitions for wiping'),
                            'style': 'margin-right: 8px; vertical-align: middle; cursor: pointer;',
                            'change': ui.createHandlerFn(this, function(ev) {
                                this.wipeAllEnabled = ev.target.checked;
                                
                                let partCheckboxes = document.querySelectorAll('.partition-select-checkbox');
                                
                                if (this.wipeAllEnabled) {
                                    partCheckboxes.forEach(cb => {
                                        if (!cb.disabled) {
                                            cb.checked = true;
                                        }
                                    });
                                } else {
                                    partCheckboxes.forEach(cb => {
                                        if (!cb.disabled) {
                                            cb.checked = false;
                                        }
                                    });
                                    this.selectedPartition = null;
                                    this.selectedUnallocated = null;
                                }
                                
                                this.updateActionButtons();
                            }),
                            'click': function(ev) {
                                ev.stopPropagation();
                            }
                        })
                    ]),
                    E('span', {
                        'style': 'pointer-events: none; user-select: none;',
                        'click': function(ev) {
                            ev.stopPropagation();
                            ev.preventDefault();
                        }
                    }, t)
                ]);
            } else {
                return E('th', {
                    'class': 'th left',
                    'style': 'width:' + equalWidth + '; min-width: 90px; text-align: left; cursor: default; pointer-events: none;'
                }, t);
            }
        });

        let table = E('table', {
            'class': 'table',
            'id': partitionTableId,
            'style': 'border:1px solid var(--border-color-medium)!important; table-layout:fixed; border-collapse:collapse; width:100%; font-size:12px;'
        }, E('tr', {'class': 'tr table-titles'}, headerRowChildren));

        if (!diskInfo.partitions || diskInfo.partitions.length === 0) {
            let totalDiskSize = diskInfo.lsblk ? diskInfo.lsblk.size : 0;
            let hasPartitionTable = diskInfo.hasPartitionTable;
            
            let unallocCheckbox = E('input', {
                'type': 'checkbox',
                'name': 'unallocated_select',
                'value': 'unallocated-0',
                'aria-label': _('Select unallocated space')
            });

            unallocCheckbox.addEventListener('click', (ev) => {
                if (ev.target.checked) {
                    this.selectedUnallocated = {
                        size: totalDiskSize,
                        start: 0,
                        end: totalDiskSize,
                        index: 0
                    };
                    this.selectedPartition = null;
                } else {
                    this.selectedUnallocated = null;
                }
                this.updateActionButtons();
            }, false);

            let message = hasPartitionTable ? 
                _('No partitions - select to create') : 
                _('No partition table - select to create');

            let unallocLabel = E('label', {
                'data-tooltip': _('Select to enable partition creation'),
                'style': 'cursor: pointer; display: inline-flex; align-items: center; gap:6px;'
            }, [
                unallocCheckbox,
                E('em', {}, message)
            ]);

            let rowsEmpty = [[
                unallocLabel, 
                _('Unallocated'), 
                '-', 
                '-', 
                this.formatSize(totalDiskSize), 
                '-', 
                '-', 
                '-'
            ]];
            
            if (typeof cbi_update_table === 'function') {
                cbi_update_table(table, rowsEmpty);
            } else {
                let tbody = E('tbody', {});
                let tr = E('tr', {'class': 'tr'});
                rowsEmpty[0].forEach(cell => {
                    tr.appendChild(E('td', {'class': 'td left'}, cell));
                });
                tbody.appendChild(tr);
                table.appendChild(tbody);
            }
            return table;
        }

        let rows = [];
        let extendedPartitions = {};

        let sortedPartitions = diskInfo.partitions.slice().sort((a, b) => {
            let aNum = parseInt(a.name.match(/\d+$/)?.[0] || '0');
            let bNum = parseInt(b.name.match(/\d+$/)?.[0] || '0');
            return aNum - bNum;
        });

        for (let i = 0; i < sortedPartitions.length; i++) {
            let part = sortedPartitions[i];
            let partNumMatch = part.name.match(/\d+$/);
            let partNum = partNumMatch ? partNumMatch[0] : '';
            let partTypeClass = this.getPartitionType(part, diskInfo);

            if (partTypeClass === 'extended') {
                extendedPartitions[partNum] = this.getLogicalPartitionsInExtended(diskInfo, partNum);
            }
        }

        let shortTypeLabels = {
            'primary': _('Primary'),
            'extended': _('Extended'),
            'logical': _('Logical')
        };

        for (let i = 0; i < sortedPartitions.length; i++) {
            let part = sortedPartitions[i];
            let partNumMatch = part.name.match(/\d+$/);
            let partNum = partNumMatch ? partNumMatch[0] : '';
            let partedInfo = parsed.partitions.find(p => p.number === partNum);

            let fsType = part.fstype || (partedInfo ? partedInfo.filesystem : '');
            let fsClass = this.normalizeFsClass(fsType);

            let partTypeClass = this.getPartitionType(part, diskInfo);

            let isLogical = partTypeClass === 'logical';
            let isExtended = partTypeClass === 'extended';

            if (isLogical) continue;

            let displayText = '';
            let indicatorClass = '';

            if (isExtended) {
                displayText = shortTypeLabels['extended'];
                indicatorClass = 'extended';
            } else if (fsType && fsType !== '' && fsClass !== 'extended' && fsClass !== 'unallocated') {
                displayText = this.getFriendlyFsName(fsType);
                indicatorClass = fsClass;
            } else {
                displayText = shortTypeLabels[partTypeClass] || partTypeClass;
                indicatorClass = partTypeClass;
            }

            (function(self, partRef, partedInfo, isExtended, extendedPartitions, partNum, fsClass, displayText, indicatorClass) {
                let isCriticalMount = partRef.mountpoint && (partRef.mountpoint === '/' || partRef.mountpoint === '/boot');
                
                let checkbox = E('input', {
                    'type': 'checkbox',
                    'class': 'partition-select-checkbox',
                    'name': 'partition_select',
                    'value': partRef.name,
                    'data-partition': partRef.name,
                    'aria-label': '/dev/' + partRef.name
                });
                
                if (isCriticalMount) {
                    checkbox.disabled = true;
                }

                checkbox.addEventListener('click', function(ev) {
                    if (ev.target.checked) {
                        self.selectedPartition = partRef;
                        self.selectedUnallocated = null;
                        let others = document.querySelectorAll('input[name="partition_select"]');
                        others.forEach(function(o) {
                            if (o !== ev.target) o.checked = false;
                        });
                        document.querySelectorAll('input[name="unallocated_select"]').forEach(function(cb) {
                            cb.checked = false;
                        });
                        ev.target.checked = true;
                    } else {
                        self.selectedPartition = null;
                    }
                    self.updateActionButtons();
                }, false);

                let partitionName = isCriticalMount ? '🔒 /dev/' + partRef.name : '/dev/' + partRef.name;
                let tooltipText = isCriticalMount ? _('System partition cannot be selected') : _('Click to select');
                
                let partitionCellDom = E('label', {
                    'data-tooltip': tooltipText,
                    'style': 'cursor: pointer; display: inline-flex; align-items: center; gap:6px;'
                }, [
                    checkbox,
                    E('span', {}, partitionName)
                ]);

                let typeCell = '<span class="partition-color-indicator ' + indicatorClass + '"></span> ' + displayText;
                let mountCell = partRef.mountpoint || '-';
                let labelCell = partRef.label || '-';
                let sizeCell = self.formatSize((partedInfo && partedInfo.size) ? partedInfo.size : partRef.size);

                if (sizeCell) {
                    sizeCell = sizeCell.replace(' TB', ' TiB').replace(' GB', ' GiB').replace(' MB', ' MiB').replace(' KB', ' KiB');
                }

                let usedCell = '-';
                let unusedCell = '-';
                if (partRef.used !== undefined && partRef.available !== undefined) {
                    usedCell = self.formatSize(partRef.used);
                    unusedCell = self.formatSize(partRef.available);
                }

                let flagsCell = '-';
                if (partedInfo && partedInfo.flags && partedInfo.flags.trim()) {
                    flagsCell = partedInfo.flags.trim();
                } else if (partRef.flags && partRef.flags.trim()) {
                    flagsCell = partRef.flags.trim();
                }

                rows.push([partitionCellDom, typeCell, mountCell, labelCell, sizeCell, usedCell, unusedCell, flagsCell]);

                if (isExtended && extendedPartitions[partNum]) {
                    extendedPartitions[partNum].sort((a, b) => {
                        let aNum = parseInt(a.name.match(/\d+$/)[0]);
                        let bNum = parseInt(b.name.match(/\d+$/)[0]);
                        return aNum - bNum;
                    });

                    extendedPartitions[partNum].forEach(function(logPart) {
                        let logPartNum = logPart.name.match(/\d+$/)[0];
                        let logPartedInfo = parsed.partitions.find(p => p.number === logPartNum);

                        let logFsType = logPart.fstype || '';
                        let logFsClass = self.normalizeFsClass(logFsType);
                        let logIndicatorClass = logFsClass && logFsClass !== 'unallocated' ? logFsClass : 'logical';

                        let isCriticalMount = logPart.mountpoint && (logPart.mountpoint === '/' || logPart.mountpoint === '/boot');

                        let logCheckbox = E('input', {
                            'type': 'checkbox',
                            'class': 'partition-select-checkbox',
                            'name': 'partition_select',
                            'value': logPart.name,
                            'data-partition': logPart.name,
                            'aria-label': '/dev/' + logPart.name
                        });
                        
                        if (isCriticalMount) {
                            logCheckbox.disabled = true;
                        }

                        logCheckbox.addEventListener('click', function(ev) {
                            if (ev.target.checked) {
                                self.selectedPartition = logPart;
                                self.selectedUnallocated = null;
                                let others = document.querySelectorAll('input[name="partition_select"]');
                                others.forEach(function(o) {
                                    if (o !== ev.target) o.checked = false;
                                });
                                document.querySelectorAll('input[name="unallocated_select"]').forEach(function(cb) {
                                    cb.checked = false;
                                });
                                ev.target.checked = true;
                            } else {
                                self.selectedPartition = null;
                            }
                            self.updateActionButtons();
                        }, false);

                        let indent = '\u00A0\u00A0';
                        let logPartitionName = isCriticalMount ? '🔒 /dev/' + logPart.name : '/dev/' + logPart.name;
                        let logTooltipText = isCriticalMount ? _('System partition cannot be selected') : _('Click to select');
                        
                        let logPartitionCellDom = E('label', {
                            'data-tooltip': logTooltipText,
                            'style': 'cursor: pointer; display: inline-flex; align-items: center; gap:6px;'
                        }, [
                            logCheckbox,
                            E('span', {}, indent + '▶ ' + logPartitionName)
                        ]);

                        let logTypeCell = '<span class="partition-color-indicator ' + logIndicatorClass + '"></span> ' + 
                                         (logFsType ? self.getFriendlyFsName(logFsType) : shortTypeLabels['logical']);
                        let logMountCell = logPart.mountpoint || '-';
                        let logLabelCell = logPart.label || '-';
                        let logSizeCell = self.formatSize(logPart.size);

                        if (logSizeCell) {
                            logSizeCell = logSizeCell.replace(' TB', ' TiB').replace(' GB', ' GiB').replace(' MB', ' MiB').replace(' KB', ' KiB');
                        }

                        let logUsedCell = '-';
                        let logUnusedCell = '-';
                        if (logPart.used !== undefined && logPart.available !== undefined) {
                            logUsedCell = self.formatSize(logPart.used);
                            logUnusedCell = self.formatSize(logPart.available);
                        }

                        let logFlagsCell = '-';
                        if (logPartedInfo && logPartedInfo.flags && logPartedInfo.flags.trim()) {
                            logFlagsCell = logPartedInfo.flags.trim();
                        }

                        rows.push([
                            logPartitionCellDom,
                            logTypeCell, 
                            logMountCell, 
                            logLabelCell, 
                            logSizeCell, 
                            logUsedCell, 
                            logUnusedCell, 
                            logFlagsCell
                        ]);
                    });
                }
            })(this, part, partedInfo, isExtended, extendedPartitions, partNum, fsClass, displayText, indicatorClass);
        }

        if (parsed && parsed.partitions) {
            let unallocCounter = 0;
            parsed.partitions.forEach((part, idx) => {
                let ptype = (part.type || '').toLowerCase();
                let fs = (part.filesystem || '').toLowerCase();
                
                // Hide < 200 MB
                if ((ptype === 'free' || fs === 'free' || fs === '' || fs === 'unallocated') && part.size >= this.MIN_VISIBLE_SIZE) {
                    let isInsideExtended = false;
                    for (let extPart of parsed.partitions) {
                        if ((extPart.type === 'extended' || extPart.filesystem === 'extended') &&
                            part.start >= extPart.start && part.end <= extPart.end) {
                            isInsideExtended = true;
                            break;
                        }
                    }
                    
                    if (!isInsideExtended) {
                        let unallocCheckbox = E('input', {
                            'type': 'checkbox',
                            'name': 'unallocated_select',
                            'value': 'unallocated-' + unallocCounter,
                            'data-unallocated-index': unallocCounter,
                            'aria-label': _('Select unallocated space')
                        });

                        unallocCheckbox.addEventListener('click', (ev) => {
                            if (ev.target.checked) {
                                this.selectedUnallocated = {
                                    size: part.size,
                                    start: part.start,
                                    end: part.end,
                                    index: unallocCounter
                                };
                                this.selectedPartition = null;
                                document.querySelectorAll('input[name="partition_select"]').forEach(cb => {
                                    cb.checked = false;
                                });
                                document.querySelectorAll('input[name="unallocated_select"]').forEach(cb => {
                                    if (cb !== ev.target) cb.checked = false;
                                });
                            } else {
                                this.selectedUnallocated = null;
                            }
                            this.updateActionButtons();
                        }, false);

                        let unallocLabel = E('label', {
                            'data-tooltip': _('Select to enable partition creation'),
                            'style': 'cursor: pointer; display: inline-flex; align-items: center; gap:6px;'
                        }, [
                            unallocCheckbox,
                            E('span', {}, _('Unallocated space'))
                        ]);

                        rows.push([
                            unallocLabel,
                            '<span class="partition-color-indicator unallocated"></span> ' + _('Unallocated'),
                            '-',
                            '-',
                            this.formatSize(part.size),
                            '-',
                            '-',
                            '-'
                        ]);

                        unallocCounter++;
                    }
                }
            });
        }

        if (typeof cbi_update_table === 'function') {
            cbi_update_table(table, rows);
        } else {
            let tbody = E('tbody', {});
            rows.forEach(r => {
                let tr = E('tr', {});
                r.forEach(cell => {
                    let td = E('td', {});
                    if (typeof cell === 'string') {
                        td.innerHTML = cell;
                    } else {
                        td.appendChild(cell);
                    }
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
        }

        for (let i = 0; i < diskInfo.partitions.length; i++) {
            let part = diskInfo.partitions[i];
            if (part.mountpoint) {
                ((p) => {
                    this.getPartitionUsage(p.mountpoint).then(usage => {
                        if (!usage) return;
                        let tbl = document.getElementById(partitionTableId);
                        if (!tbl) return;
                        let rowsDom = tbl.querySelectorAll('tbody tr');
                        if (!rowsDom || rowsDom.length === 0) {
                            rowsDom = tbl.querySelectorAll('tr');
                        }
                        for (let r = 0; r < rowsDom.length; r++) {
                            let firstCell = rowsDom[r].querySelector('td');
                            if (!firstCell) continue;
                            let cellText = firstCell.textContent.trim();
                            cellText = cellText.replace(/[\u00A0\s▶➤↳►▸↦↳]/g, '').trim();
                            cellText = cellText.replace(/^[^\/]*\/dev\//, '/dev/');
                            if (cellText === '/dev/' + p.name) {
                                let cells = rowsDom[r].querySelectorAll('td');
                                if (cells && cells.length >= 7) {
                                    if (usage.used) {
                                        if (usage.used.includes('T')) {
                                            cells[5].textContent = usage.used.replace('T', ' TiB');
                                        } else if (usage.used.includes('G')) {
                                            cells[5].textContent = usage.used.replace('G', ' GiB');
                                        } else if (usage.used.includes('M')) {
                                            cells[5].textContent = usage.used.replace('M', ' MiB');
                                        } else if (usage.used.includes('K')) {
                                            cells[5].textContent = usage.used.replace('K', ' KiB');
                                        } else {
                                            cells[5].textContent = usage.used || '-';
                                        }
                                    }
                                    if (usage.available) {
                                        if (usage.available.includes('T')) {
                                            cells[6].textContent = usage.available.replace('T', ' TiB');
                                        } else if (usage.available.includes('G')) {
                                            cells[6].textContent = usage.available.replace('G', ' GiB');
                                        } else if (usage.available.includes('M')) {
                                            cells[6].textContent = usage.available.replace('M', ' MiB');
                                        } else if (usage.available.includes('K')) {
                                            cells[6].textContent = usage.available.replace('K', ' KiB');
                                        } else {
                                            cells[6].textContent = usage.available || '-';
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }).catch(() => {});
                })(part);
            }
        }

        return table;
    },


    getPartitionUsage: function(mountpoint) {
        return L.resolveDefault(fs.exec('/bin/df', ['-h', mountpoint]), null).then(res => {
            if (res && res.code === 0) {
                let lines = res.stdout.trim().split('\n');
                if (lines.length >= 2) {
                    let fields = lines[1].split(/\s+/);
                    return {
                        total: fields[1],
                        used: fields[2],
                        available: fields[3],
                        percent: parseInt(fields[4])
                    };
                }
            }
            return null;
        });
    },

    formatSize: function(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        let sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = Math.floor(Math.log(bytes) / Math.log(1024));
        if (i < 0) i = 0;
        if (i >= sizes.length) i = sizes.length - 1;
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    },

    updateActionButtons: function() {
        if (!this.selectedDisk) {
            ['btn-mount', 'btn-unmount', 'btn-create', 'btn-resize', 'btn-delete', 'btn-format', 'btn-wipe'].forEach(id => {
                let btn = document.getElementById(id);
                if (btn) btn.setAttribute('disabled', 'disabled');
            });
            return;
        }

        let diskInfo = this.diskData[this.selectedDisk];
        let hasPartition = !!this.selectedPartition;
        let hasUnallocated = !!this.selectedUnallocated;

        let isSelectedPartitionMounted = hasPartition && this.isPartitionMounted(this.selectedPartition);
        let hasAnyMountedPartition = this.hasAnyPartitionMounted(this.selectedDisk);
        let totalUnallocated = diskInfo ? this.getTotalUnallocatedSpace(diskInfo) : 0;
        let hasPartitionTable = diskInfo && diskInfo.hasPartitionTable;

        let mountBtn = document.getElementById('btn-mount');
        let unmountBtn = document.getElementById('btn-unmount');
        let createBtn = document.getElementById('btn-create');
        let resizeBtn = document.getElementById('btn-resize');
        let deleteBtn = document.getElementById('btn-delete');
        let formatBtn = document.getElementById('btn-format');
        let wipeBtn = document.getElementById('btn-wipe');

        let isExtendedSelected = hasPartition && 
            this.getPartitionType(this.selectedPartition, diskInfo) === 'extended';

        if (mountBtn) {
            if (!hasPartition || isSelectedPartitionMounted || isExtendedSelected) {
                mountBtn.setAttribute('disabled', 'disabled');
            } else {
                mountBtn.removeAttribute('disabled');
            }
        }

        if (unmountBtn) {
            if (!hasPartition || !isSelectedPartitionMounted) {
                unmountBtn.setAttribute('disabled', 'disabled');
            } else {
                unmountBtn.removeAttribute('disabled');
            }
        }

        if (createBtn) {            
            if (!hasAnyMountedPartition && (hasUnallocated || isExtendedSelected)) {
                createBtn.removeAttribute('disabled');
            } else {
                createBtn.setAttribute('disabled', 'disabled');
            }
        }

        if (resizeBtn) {
            if (hasPartition && this.canResizePartition(this.selectedPartition)) {
                resizeBtn.removeAttribute('disabled');
            } else {
                resizeBtn.setAttribute('disabled', 'disabled');
            }
        }

        if (deleteBtn) {
            if (hasAnyMountedPartition || !hasPartition || hasUnallocated || this.wipeAllEnabled) {
                deleteBtn.setAttribute('disabled', 'disabled');
            } else {
                deleteBtn.removeAttribute('disabled');
            }
        }

        if (formatBtn) {
            if (hasAnyMountedPartition || !hasPartition || hasUnallocated || isExtendedSelected) {
                formatBtn.setAttribute('disabled', 'disabled');
            } else {
                formatBtn.removeAttribute('disabled');
            }
        }

        if (wipeBtn) {
            if (!this.wipeAllEnabled || this.hasDdSupport === false || hasAnyMountedPartition) {
                wipeBtn.setAttribute('disabled', 'disabled');
            } else {
                wipeBtn.removeAttribute('disabled');
            }
        }

        let wipeCheckbox = document.getElementById('wipeall-checkbox');
        if (wipeCheckbox) {
            let hasPartitions = diskInfo && diskInfo.partitions && diskInfo.partitions.length > 0;
            
            if (hasAnyMountedPartition || !hasPartitions) {
                wipeCheckbox.disabled = true;
                wipeCheckbox.checked = false;
                this.wipeAllEnabled = false;
            } else {
                wipeCheckbox.disabled = false;
            }
        }
    },

    showCreatePartitionDialog: function() {
        if (!this.selectedDisk) {
            ui.addNotification(null, E('p', _('Please select a disk first')), 'warning');
            return;
        }

        if (this.hasAnyPartitionMounted(this.selectedDisk)) {
            ui.addNotification(null, E('p', _('Cannot create partition on mounted disk. Please unmount first.')), 'warning');
            return;
        }

        this.getDiskInfo(this.selectedDisk).then(async (diskInfo) => {
            this.diskData[this.selectedDisk] = diskInfo;

            let totalUnallocated = this.getTotalUnallocatedSpace(diskInfo);
            let isExtendedSelected = this.selectedPartition && 
                this.getPartitionType(this.selectedPartition, diskInfo) === 'extended';

            if (totalUnallocated === 0 && diskInfo.hasPartitionTable && !isExtendedSelected) {
                ui.addNotification(null, E('p', _('No unallocated space available on this disk')), 'warning');
                return;
            }

            let existingLayout = null;
            if (diskInfo.fdisk && diskInfo.fdisk.indexOf('GPT') !== -1) {
                existingLayout = 'gpt';
            } else if (diskInfo.fdisk && diskInfo.fdisk.indexOf('DOS') !== -1) {
                existingLayout = 'mbr';
            }

            let freeSpace = totalUnallocated || (diskInfo.lsblk ? diskInfo.lsblk.size : 0);
            if (isExtendedSelected) {
                if (!diskInfo.parted) {
                    ui.addNotification(null, E('p', _('Cannot read partition information')), 'error');
                    return;
                }
                
                let parsed = this.parsePartedOutput(diskInfo.parted);
                let extPartNum = this.selectedPartition.name.match(/\d+$/);
                if (!extPartNum) {
                    ui.addNotification(null, E('p', _('Invalid extended partition')), 'error');
                    return;
                }
                
                let extendedPartInfo = parsed.partitions.find(p => 
                    p.number === extPartNum[0] && 
                    (p.type === 'extended' || p.filesystem === 'extended')
                );
                
                if (!extendedPartInfo || !extendedPartInfo.size) {
                    ui.addNotification(null, E('p', _('Extended partition not found or has invalid size')), 'error');
                    return;
                }
                
                let logicalParts = this.getLogicalPartitionsInExtended(diskInfo, extPartNum[0]);
                let usedLogicalSize = 0;
                logicalParts.forEach(lp => {
                    usedLogicalSize += (lp.size || 0);
                });
                
                freeSpace = extendedPartInfo.size - usedLogicalSize;
                
                const MIN_PARTITION_SIZE = 10 * 1024 * 1024; // 10MB minimum
                if (freeSpace < MIN_PARTITION_SIZE) {
                    let freeSpaceMB = (freeSpace / (1024 * 1024)).toFixed(2);
                    let extSizeMB = (extendedPartInfo.size / (1024 * 1024)).toFixed(2);
                    let usedMB = (usedLogicalSize / (1024 * 1024)).toFixed(2);
                    ui.showModal(_('Cannot Create Partition'), [
                        E('div', {'class': 'cbi-section'}, [
                            E('div', {'class': 'alert-message warning'}, [
                                E('strong', {}, _('Insufficient Space')),
                                E('br'),
                                E('br'),
                                _('Not enough free space in extended partition /dev/%s').format(this.selectedPartition.name),
                                E('br'),
                                E('br'),
                                _('Extended partition size: %s MB').format(extSizeMB),
                                E('br'),
                                _('Used by logical partitions: %s MB').format(usedMB),
                                E('br'),
                                _('Available for new logical: %s MB').format(freeSpaceMB),
                                E('br'),
                                E('br'),
                                _('Required minimum: 10 MB')
                            ])
                        ]),
                        E('div', {'class': 'right'}, [
                            E('button', {'class': 'btn', 'click': ui.hideModal}, _('Close'))
                        ])
                    ]);
                    return;
                }
            }
            
            let freeSpaceMB = Math.floor(freeSpace / (1024 * 1024));
            let freeSpaceGB = (freeSpaceMB / 1024).toFixed(2);
            let freeSpaceTB = (freeSpaceGB / 1024).toFixed(2);

            let convertToMB = function(value, unit) {
                let val = parseFloat(value);
                if (isNaN(val)) return 0;
                switch(unit) {
                    case 'MB': return val;
                    case 'GB': return val * 1024;
                    case 'TB': return val * 1024 * 1024;
                    default: return 0;
                }
            };

            let convertFromMB = function(mb, unit) {
                if (typeof mb !== 'number') return '0';
                switch(unit) {
                    case 'MB': return mb;
                    case 'GB': return (mb / 1024);
                    case 'TB': return (mb / 1024 / 1024);
                    default: return mb;
                }
            };

            let updateMaxSize = function() {
                let unitEl = document.getElementById('size_unit');
                let sizeInput = document.getElementById('part_size');
                if (!unitEl || !sizeInput) return;

                let unit = unitEl.value;
                let maxInUnit = convertFromMB(freeSpaceMB, unit);
                sizeInput.setAttribute('data-max', maxInUnit);

                let currentVal = parseFloat(sizeInput.value);
                if (!isNaN(currentVal) && currentVal > maxInUnit) {
                    sizeInput.value = Number(maxInUnit).toFixed(2);
                }
            };

            let updatePartitionTypes = function() {
                let layoutSelect = document.getElementById('part_layout');
                let partTypeSelect = document.getElementById('part_part_type');
                let fsTypeSelect = document.getElementById('fs_type');
                let labelInput = document.getElementById('part_label');
                let layoutInfo = document.getElementById('layout_info');

                if (!layoutSelect || !partTypeSelect || !fsTypeSelect || !labelInput || !layoutInfo) {
                    return;
                }

                partTypeSelect.innerHTML = '';
                layoutInfo.innerHTML = '';

                let isExtendedSelected = this.selectedPartition && 
                    this.getPartitionType(this.selectedPartition, diskInfo) === 'extended';
                let hasExtendedPartition = false;
                
                if (diskInfo.partitions) {
                    for (let part of diskInfo.partitions) {
                        if (this.getPartitionType(part, diskInfo) === 'extended') {
                            hasExtendedPartition = true;
                            break;
                        }
                    }
                }

                if (isExtendedSelected) {
                    partTypeSelect.appendChild(E('option', {'value': 'logical'}, _('Logical')));
                    partTypeSelect.disabled = true;
                    layoutInfo.innerHTML = '<div style="margin-top:8px;padding:8px;background:var(--background-color-medium);border:1px solid var(--border-color-medium);border-radius:4px;font-size:12px;">' + 
                        _('Creating partition inside extended partition. Only logical partitions can be created here.') + '</div>';
                } else if (!diskInfo.hasPartitionTable) {
                    partTypeSelect.appendChild(E('option', {'value': 'primary'}, _('Primary')));
                    partTypeSelect.disabled = true;
                    layoutInfo.innerHTML = '<div style="margin-top:8px;padding:8px;background:var(--background-color-medium);border:1px solid var(--border-color-medium);border-radius:4px;font-size:12px;">' + 
                        _('No partition table detected. A primary partition will be created and a partition table will be initialized.') + '</div>';
                } else {
                    partTypeSelect.appendChild(E('option', {'value': 'primary'}, _('Primary')));
                    if (!hasExtendedPartition) {
                        partTypeSelect.appendChild(E('option', {'value': 'extended'}, _('Extended')));
                    }
                    partTypeSelect.disabled = false;
                    
                    if (hasExtendedPartition) {
                        layoutInfo.innerHTML = '<div style="margin-top:8px;padding:8px;background:var(--background-color-medium);border:1px solid var(--border-color-medium);border-radius:4px;font-size:12px;">' + 
                            _('Extended partition already exists. You can create primary partitions or select the extended partition to create logical partitions inside.') + '</div>';
                    }
                }

                fsTypeSelect.disabled = false;
                labelInput.disabled = false;

                if (partTypeSelect.options.length > 0) {
                    let changeEvent = new Event('change');
                    partTypeSelect.dispatchEvent(changeEvent);
                }
            }.bind(this);

            let refreshPartitionData = function() {
                let refreshBtn = document.getElementById('refresh-partition-btn');
                if (refreshBtn) {
                    refreshBtn.disabled = true;
                    refreshBtn.innerHTML = '<span class="spinning"></span> ' + _('Refreshing...');
                }

                this.getDiskInfo(this.selectedDisk).then(freshDiskInfo => {
                    this.diskData[this.selectedDisk] = freshDiskInfo;

                    updatePartitionTypes();

                    let newTotalUnallocated = this.getTotalUnallocatedSpace(freshDiskInfo);
                    let newFreeSpace = newTotalUnallocated;
                    
                    if (isExtendedSelected && this.selectedPartition) {
                        let extPartNum = this.selectedPartition.name.match(/\d+$/);
                        if (extPartNum) {
                            let freshExtPart = freshDiskInfo.partitions.find(p => {
                                let num = p.name.match(/\d+$/);
                                return num && num[0] === extPartNum[0];
                            });
                            if (freshExtPart) {
                                let logicalParts = this.getLogicalPartitionsInExtended(freshDiskInfo, extPartNum[0]);
                                let usedLogicalSize = 0;
                                logicalParts.forEach(lp => {
                                    usedLogicalSize += (lp.size || 0);
                                });
                                newFreeSpace = freshExtPart.size - usedLogicalSize;
                            }
                        }
                    }
                    
                    let newFreeSpaceMB = Math.floor(newFreeSpace / (1024 * 1024));
                    let newFreeSpaceGB = (newFreeSpaceMB / 1024).toFixed(2);
                    let newFreeSpaceTB = (newFreeSpaceGB / 1024).toFixed(2);

                    freeSpaceMB = newFreeSpaceMB;
                    freeSpaceGB = newFreeSpaceGB;
                    freeSpaceTB = newFreeSpaceTB;

                    let freeSpaceInfo = document.querySelector('#available-space-info');
                    if (freeSpaceInfo) {
                        freeSpaceInfo.textContent = _('Available: %s MB / %s GB / %s TB').format(
                            newFreeSpaceMB, 
                            newFreeSpaceGB, 
                            newFreeSpaceTB
                        );
                    }

                    updateMaxSize();

                    if (refreshBtn) {
                        refreshBtn.disabled = false;
                        refreshBtn.innerHTML = _('Refresh partition data');
                    }

                    this.popTimeout(null, E('p', _('Partition data refreshed')), 3000, 'info');
                }).catch(err => {
                    ui.addNotification(null, E('p', _('Failed to refresh partition data: ') + err.message), 'error');
                    if (refreshBtn) {
                        refreshBtn.disabled = false;
                        refreshBtn.innerHTML = _('Refresh partition data');
                    }
                });
            }.bind(this);

            const supported = await this.detectSupportedFilesystems();
            const fsOptions = ['ext4', 'ext3', 'ext2', 'f2fs', 'ntfs', 'vfat', 'exfat', 'swap'];

            ui.showModal(_('Create partition'), [
                E('div', {'class': 'cbi-section'}, [
                    E('div', {'class': 'cbi-section-descr'}, _('Create a new partition on the selected disk')),
                    E('div', {'class': 'cbi-section'}, [
                        E('div', {'class': 'cbi-value'}, [
                            E('label', {'class': 'cbi-value-title'}, _('Partition layout')),
                            E('div', {'class': 'cbi-value-field'}, [
                                E('select', {
                                    'class': 'cbi-input-select', 
                                    'id': 'part_layout',
                                    'change': updatePartitionTypes
                                }, existingLayout ? [
                                    E('option', {'value': existingLayout, 'selected': 'selected'}, 
                                        existingLayout === 'gpt' ? _('GPT (GUID Partition Table)') : _('MBR (Master Boot Record)'))
                                ] : [
                                    E('option', {'value': 'mbr'}, _('MBR (Master Boot Record)')),
                                    E('option', {'value': 'gpt'}, _('GPT (GUID Partition Table)'))
                                ]),
                                E('div', {'id': 'layout_info'})
                            ])
                        ]),
                        E('div', {'class': 'cbi-value'}, [
                            E('label', {'class': 'cbi-value-title'}, _('Partition type')),
                            E('div', {'class': 'cbi-value-field'}, [
                                E('select', {
                                    'class': 'cbi-input-select', 
                                    'id': 'part_part_type', 
                                    'change': function() {
                                        let fsTypeSelect = document.getElementById('fs_type');
                                        let labelInput = document.getElementById('part_label');
                                        if (this.value === 'extended') {
                                            fsTypeSelect.disabled = true;
                                            fsTypeSelect.value = '';
                                            labelInput.disabled = true;
                                            labelInput.value = '';
                                        } else {
                                            fsTypeSelect.disabled = false;
                                            labelInput.disabled = false;
                                        }
                                    }
                                })
                            ])
                        ]),
                        E('div', {'class': 'cbi-value'}, [
                            E('label', {'class': 'cbi-value-title'}, _('File system')),
                            E('div', {'class': 'cbi-value-field'}, [
                                E('select', {'class': 'cbi-input-select', 'id': 'fs_type'}, [
                                    E('option', {'value': '', 'selected': 'selected', 'disabled': true}, _('Loading...'))
                                ])
                            ])
                        ]),
                        E('div', {'class': 'cbi-value'}, [
                            E('label', {'class': 'cbi-value-title'}, _('Volume label')),
                            E('div', {'class': 'cbi-value-field'}, [
                                E('input', {'class': 'cbi-input-text', 'id': 'part_label', 'type': 'text', 
                                    'placeholder': _('Optional')})
                            ])
                        ]),
                        E('div', {'class': 'cbi-value'}, [
                            E('label', {'class': 'cbi-value-title'}, _('Partition size')),
                            E('div', {'class': 'cbi-value-field'}, [
                                E('div', {'class': 'size-input-group'}, [
                                    E('input', {
                                        'class': 'cbi-input-text', 
                                        'id': 'part_size', 
                                        'type': 'text',
                                        'placeholder': _('Enter size'),
                                        'data-max': freeSpaceGB
                                    }),
                                    E('select', {
                                        'class': 'cbi-input-select',
                                        'id': 'size_unit',
                                        'change': updateMaxSize
                                    }, [
                                        E('option', {'value': 'MB'}, _('MB')),
                                        E('option', {'value': 'GB', 'selected': 'selected'}, _('GB')),
                                        E('option', {'value': 'TB'}, _('TB'))
                                    ])
                                ]),
                                E('div', {'style': 'margin-top: 5px; font-size: 12px; color: var(--text-color-secondary)'}, [
                                    E('div', {
                                        'id': 'available-space-info',
                                        'style': 'margin-top: 3px;'
                                    }, 
                                        _('Available: %s MB / %s GB / %s TB').format(
                                            freeSpaceMB, 
                                            freeSpaceGB, 
                                            freeSpaceTB
                                        ))
                                ])
                            ])
                        ])
                    ])
                ]),
                E('div', { 'class': 'cbi-value' }, [
                    E('label', { 'class': 'cbi-value-title' }, _('All available space')),
                    E('div', { 'class': 'cbi-value-field' }, [
                        E('button', {
                            'id': 'use_max_size',
                            'class': 'btn',
                            'click': function () {
                                let sizeInput = document.getElementById('part_size');
                                let unitSelect = document.getElementById('size_unit');
                                if (!sizeInput || !unitSelect) return;
                                let unit = unitSelect.value;
                                let maxInUnit = convertFromMB(freeSpaceMB, unit);
                                sizeInput.value = Number(maxInUnit).toFixed(2);
                                sizeInput.setAttribute('data-max', maxInUnit);
                            }
                        }, _('Fill in size'))
                    ])
                ]),
                E('div', {'style': 'display: flex; justify-content: space-between; align-items: center;'}, [
                    E('div', {}, [
                        E('button', {'class': 'btn', 'click': ui.hideModal}, _('Cancel'))
                    ]),
                    E('div', {}, [
                        E('button', {
                            'class': 'btn cbi-button',
                            'id': 'refresh-partition-btn',
                            'click': refreshPartitionData
                        }, _('Refresh partition data')),
                        ' ',
                        E('button', {
                            'class': 'btn cbi-button-action',
                            'id': 'create_partition_confirm'
                        }, _('Create'))
                    ])
                ])
            ]);

            setTimeout(() => {
                const fsSelect = document.getElementById('fs_type');
                if (!fsSelect) return;

                fsSelect.innerHTML = '';

                if (supported && supported.length > 0) {
                    const preferred = ['ext4','ext3','ext2','f2fs','vfat','ntfs','exfat','swap'];
                    const ordered = preferred.filter(x => supported.indexOf(x) !== -1).concat(supported.filter(x => preferred.indexOf(x) === -1));
                    ordered.forEach((fsName, idx) => {
                        let label = this.getFriendlyFsName(fsName);
                        let opt = E('option', {'value': fsName}, label);
                        if (idx === 0) opt.setAttribute('selected', 'selected');
                        fsSelect.appendChild(opt);
                    });
                } else {
                    fsSelect.appendChild(E('option', {'value': '', 'disabled': true}, _('No supported filesystems detected on this system')));
                    ui.addNotification(null, E('p', _('No filesystem packages detected — user cannot choose unsupported filesystem formats.')), 'warning');
                }

                const createBtn = document.getElementById('create_partition_confirm');

                if (createBtn) {
                    createBtn.addEventListener('click', ui.createHandlerFn(this, function() {
                        let partTypeSelect = document.getElementById('part_part_type');

                        if (partTypeSelect.options.length === 0 || partTypeSelect.value === '') {
                            ui.addNotification(null, E('p', _('No partition types available. Maximum partitions reached.')), 'warning');
                            return;
                        }

                        let sizeValue = document.getElementById('part_size').value.trim();
                        let unit = document.getElementById('size_unit').value;

                        if (!sizeValue || parseFloat(sizeValue) <= 0) {
                            ui.addNotification(null, E('p', _('Please enter a valid size')), 'warning');
                            return;
                        }

                        let multiplier = 1;
                        if (unit === 'KB') multiplier = 1/1024;
                        if (unit === 'GB') multiplier = 1024;
                        if (unit === 'TB') multiplier = 1024*1024;
                        let sizeMB = parseFloat(sizeValue) * multiplier;

                        if (isNaN(sizeMB) || sizeMB < 1) {
                            ui.addNotification(null, E('p', _('Size is too small')), 'warning');
                            return;
                        }

                        let size = Math.floor(sizeMB).toString();

                        ui.hideModal();

                        this.createPartition(
                            document.getElementById('part_part_type').value,
                            document.getElementById('fs_type').value,
                            document.getElementById('part_label').value,
                            size,
                            document.getElementById('part_layout').value
                        );
                    }));
                }

                if (existingLayout) {
                    let layoutSelect = document.getElementById('part_layout');
                    if (layoutSelect) {
                        layoutSelect.disabled = true;
                    }
                }

                updatePartitionTypes();
                updateMaxSize();

                const sizeInput = document.getElementById('part_size');
                const unitSelect = document.getElementById('size_unit');
                const useMaxButton = document.getElementById('use_max_size');

                const clampSizeInput = function() {
                    if (!sizeInput || !unitSelect) return;
                    let unit = unitSelect.value;
                    let maxInUnit = parseFloat(sizeInput.getAttribute('data-max')) || convertFromMB(freeSpaceMB, unit);

                    let val = parseFloat(sizeInput.value);
                    if (isNaN(val)) return;
                    if (val <= 0) {
                        sizeInput.value = Number(Math.max(0.01, val)).toFixed(2);
                        return;
                    }

                    if (val > maxInUnit) {
                        sizeInput.value = Number(maxInUnit).toFixed(2);
                    }
                };

                if (sizeInput) {
                    sizeInput.addEventListener('input', clampSizeInput, false);
                }
                if (unitSelect) {
                    unitSelect.addEventListener('change', function() {
                        updateMaxSize();
                        clampSizeInput();
                    }, false);
                }
                if (useMaxButton) {
                    useMaxButton.addEventListener('click', function() {
                        let unit = unitSelect ? unitSelect.value : 'GB';
                        let maxInUnit = convertFromMB(freeSpaceMB, unit);
                        if (sizeInput) {
                            sizeInput.value = Number(maxInUnit).toFixed(2);
                            sizeInput.setAttribute('data-max', maxInUnit);
                        }
                    }, false);
                }

            }, 60);

        }).catch(err => {
            ui.addNotification(null, E('p', _('Failed to load disk information: ') + err.message), 'error');
            console.error('showCreatePartitionDialog error:', err);
        });
    },

    createPartition: async function(type, fstype, label, size, layout) {
        const restorer = this.disableAllButtonsAndRemember();
        try {
            if (!this.selectedDisk) {
                ui.addNotification(null, E('p', _('Please select a disk first')), 'warning');
                return;
            }

            if (this.hasAnyPartitionMounted(this.selectedDisk)) {
                ui.addNotification(null, E('p', _('Cannot create partition on mounted disk. Please unmount first.')), 'warning');
                return;
            }

            let diskInfo = await this.getDiskInfo(this.selectedDisk);
            this.diskData[this.selectedDisk] = diskInfo;

            let device = '/dev/' + this.selectedDisk;

            let result = await this.callRpcd('create_partition', {
                device: device,
                type: type,
                fstype: fstype,
                size: size || '',
                layout: layout,
                label: label || ''
            });

            if (result.success && result.pid) {
                await this.monitorOperation(
                    result.pid,
                    _('Creating partition...'),
                    _('Partition created successfully'),
                    _('Failed to create partition')
                );
            } else {
                throw new Error(result.error || _('Failed to start partition creation'));
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            let freshDiskInfo = await this.getDiskInfo(this.selectedDisk);
            this.diskData[this.selectedDisk] = freshDiskInfo;

            if (freshDiskInfo.partitions && freshDiskInfo.partitions.length > 0) {
                let lastPart = freshDiskInfo.partitions[freshDiskInfo.partitions.length - 1];
                let path = '/dev/' + lastPart.name;

                let exists = await this.waitForDevice(path, 20, 500);
                if (exists && fstype && fstype !== 'extended') {
                    const supported = await this.detectSupportedFilesystems();
                    if (supported && supported.indexOf(fstype) !== -1) {
                        await this.formatPartition(lastPart.name, fstype, label, true, true);
                    } else {
                        ui.addNotification(null, E('p', _('Partition created but selected filesystem is not available for formatting on this system')), 'warning');
                        this.refreshDiskView();
                    }
                } else if (!exists) {
                    ui.addNotification(null, E('p', _('Partition created but device node did not appear in time')), 'warning');
                    this.refreshDiskView();
                } else {
                    this.refreshDiskView();
                }
            } else {
                this.refreshDiskView();
            }
        } catch (err) {
            this.hideOperationStatus();
            console.error('createPartition error:', err);
        } finally {
            try { restorer.restore(); } catch (e) { console.error('restore buttons failed', e); }
        }
    },

    showFormatDialog: function() {
        if (!this.selectedPartition) {
            ui.addNotification(null, E('p', _('Please select a partition first')), 'warning');
            return;
        }

        if (this.isPartitionMounted(this.selectedPartition)) {
            ui.addNotification(null, E('p', _('Cannot format mounted partition. Please unmount first.')), 'warning');
            return;
        }

        let partName = this.selectedPartition.name;

        this.detectSupportedFilesystems().then((supported) => {
            let fsOptions = [];
            if (supported && supported.length > 0) {
                const preferred = ['ext4','ext3','ext2','f2fs','vfat','ntfs','exfat','swap'];
                const ordered = preferred.filter(x => supported.indexOf(x) !== -1).concat(supported.filter(x => preferred.indexOf(x) === -1));
                ordered.forEach((fsName, idx) => {
                    fsOptions.push(E('option', {'value': fsName, ...(idx===0?{'selected':'selected'}:{})}, this.getFriendlyFsName(fsName)));
                });
            } else {
                fsOptions.push(E('option', {'value': '', 'disabled': true, 'selected': 'selected'}, _('No supported filesystems detected on this system')));
            }

            ui.showModal(_('Format Partition'), [
                E('div', {'class': 'cbi-section'}, [
                    E('div', {'class': 'alert-message warning'}, [
                        E('strong', {}, _('Warning')),
                        E('br'),
                        _('This will erase all data on /dev/%s').format(partName)
                    ]),
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('Partition')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('input', {
                                'class': 'cbi-input-text',
                                'type': 'text',
                                'value': '/dev/' + partName,
                                'disabled': 'disabled'
                            })
                        ])
                    ]),
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('File system')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('select', {'class': 'cbi-input-select', 'id': 'format_fs_type'}, fsOptions)
                        ])
                    ]),
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('Volume label')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('input', {'class': 'cbi-input-text', 'id': 'format_label', 'type': 'text', 
                                'placeholder': _('Optional')})
                        ])
                    ])
                ]),
                E('div', {'class': 'right'}, [
                    E('button', {'class': 'btn', 'click': ui.hideModal}, _('Cancel')),
                    ' ',
                    E('button', {
                        'class': 'btn cbi-button-negative',
                        'click': ui.createHandlerFn(this, function() {
                            let fstypeEl = document.getElementById('format_fs_type');
                            let fstype = fstypeEl ? fstypeEl.value : '';
                            let label = document.getElementById('format_label').value;

                            if (!fstype) {
                                ui.addNotification(null, E('p', _('Please select a filesystem')), 'warning');
                                return;
                            }
                            if (fstype === 'extended') {
                    				// Not need filesystem validation
				            } else if (fstype && supported && supported.length > 0 && supported.indexOf(fstype) === -1) {
                    				ui.addNotification(null, E('p', _('Selected filesystem is not supported on this system')), 'warning');
                    				return;
				            }

                            ui.hideModal();
                            this.formatPartition(partName, fstype, label, false);
                        })
                    }, _('Format'))
                ])
            ]);
        }).catch(err => {
            ui.showModal(_('Format Partition'), [
                E('p', {}, _('Failed to detect supported filesystems')),
                E('pre', {}, (err && err.toString()) ? err.toString() : String(err)),
                E('div', { 'class': 'right' }, [
                    E('div', { 'class': 'btn cbi-button-neutral', 'click': ui.hideModal }, _('Close'))
                ])
            ]);
        });
    },

    formatPartition: async function(partition, fstype, label, skipModal, skipDisable) {
        const restorer = (skipDisable ? { restore: function() {} } : this.disableActiveButtonsAndRemember());
        try {
            const supported = await this.detectSupportedFilesystems();
            if (fstype === 'extended') {
		        // Not need filesystem validation
		    } else if (fstype && supported && supported.length > 0 && supported.indexOf(fstype) === -1) {
    			ui.addNotification(null, E('p', _('Selected filesystem is not supported on this system')), 'warning');
    			return;
		    }

            let device = '/dev/' + partition;

            let result = await this.callRpcd('format_partition', {
                device: device,
                fstype: fstype,
                label: label || ''
            });

            if (result.success && result.pid) {
                await this.monitorOperation(
                    result.pid,
                    _('Formatting partition...'),
                    _('Partition formatted successfully'),
                    _('Failed to format partition')
                );
            } else {
                throw new Error(result.error || _('Failed to start formatting'));
            }

            this.refreshDiskView();
        } catch (err) {
            this.hideOperationStatus();
            console.error('formatPartition error:', err);
        } finally {
            try { restorer.restore(); } catch (e) { console.error('restore buttons failed', e); }
        }
    },

    showWipeDialog: function() {
        if (!this.selectedDisk || !this.wipeAllEnabled) {
            ui.addNotification(null, E('p', _('Please enable wipe mode first')), 'warning');
            return;
        }

        let diskName = this.selectedDisk;
        let diskInfo = this.diskData[diskName];

        if (this.hasAnyPartitionMounted(diskName)) {
            ui.addNotification(null, E('p', _('Cannot wipe disk with mounted partitions. Please unmount all partitions first.')), 'warning');
            return;
        }

        ui.showModal(_('Wipe Disk'), [
            E('div', {'class': 'cbi-section'}, [
                E('div', {'class': 'alert-message warning'}, [
                    E('strong', {}, _('WARNING')),
                    E('br'),
                    _('This will completely erase the partition table and all data on /dev/%s!').format(diskName),
                    E('br'),
                    E('br'),
                    E('strong', {}, _('THIS OPERATION CANNOT BE UNDONE!'))
                ]),
                E('p', {}, _('Number of partitions to be deleted: %d').format(diskInfo.partitions.length)),
                E('p', {}, _('Are you absolutely sure you want to continue?'))
            ]),
            E('div', {'class': 'right'}, [
                E('button', {'class': 'btn', 'click': ui.hideModal}, _('Cancel')),
                ' ',
                E('button', {
                    'class': 'btn cbi-button-negative',
                    'click': ui.createHandlerFn(this, function() {
                        ui.hideModal();
                        this.wipeDisk(diskName);
                    })
                }, _('Wipe Disk'))
            ])
        ]);
    },

    wipeDisk: async function(diskName) {
        const restorer = this.disableActiveButtonsAndRemember();
        try {
            let device = '/dev/' + diskName;

            let result = await this.callRpcd('wipe_disk', {
                device: device
            });

            if (result.success && result.pid) {
                await this.monitorOperation(
                    result.pid,
                    _('Wiping disk partition table...'),
                    _('Disk partition table has been successfully erased'),
                    _('Failed to wipe disk')
                );
            } else {
                throw new Error(result.error || _('Failed to start disk wipe'));
            }

            this.wipeAllEnabled = false;
            let wipeCheckbox = document.getElementById('wipeall-checkbox');
            if (wipeCheckbox) {
                wipeCheckbox.checked = false;
            }
            this.selectedPartition = null;
            this.selectedUnallocated = null;
            this.refreshDiskView();
        } catch (err) {
            this.hideOperationStatus();
            console.error('wipeDisk error:', err);
        } finally {
            try { restorer.restore(); } catch (e) { console.error('restore buttons failed', e); }
        }
    },

    showResizeDialog: async function() {
        if (!this.selectedPartition) {
            ui.addNotification(null, E('p', _('Please select a partition first')), 'warning');
            return;
        }

        if (!this.canResizePartition(this.selectedPartition)) {
            ui.addNotification(null, E('p', _('Selected partition cannot be resized. Only unmounted Ext2/3/4 partitions with available space can be resized.')), 'warning');
            return;
        }

        const installed = await this.getInstalledPackages();
        const has = (name) => this._isPackageInstalledFromList(installed, name);

        const hasParted = has('parted');
        const hasE2fsprogs = has('e2fsprogs');
        const hasKmodExt4 = has('kmod-fs-ext4');
        const hasBc = has('bc');
        const hasResize2fs = has('resize2fs');

        const resizeSupported = hasParted && hasE2fsprogs && hasKmodExt4 && hasBc && hasResize2fs;

        if (!resizeSupported) {
            return;
        }

        let part = this.selectedPartition;
        let partName = part.name;
        let currentSize = part.size;
        let availableSpace = this.getAvailableSpaceForResize(part);
        let maxSize = currentSize + availableSpace;

        let currentSizeMB = Math.floor(currentSize / (1024 * 1024));
        let currentSizeGB = (currentSizeMB / 1024).toFixed(2);
        let currentSizeTB = (currentSizeGB / 1024).toFixed(2);

        let availableSpaceMB = Math.floor(availableSpace / (1024 * 1024));
        let availableSpaceGB = (availableSpaceMB / 1024).toFixed(2);
        let availableSpaceTB = (availableSpaceGB / 1024).toFixed(2);

        let maxSizeMB = Math.floor(maxSize / (1024 * 1024));
        let maxSizeGB = (maxSizeMB / 1024).toFixed(2);
        let maxSizeTB = (maxSizeGB / 1024).toFixed(2);

        let convertToMB = function(value, unit) {
            let val = parseFloat(value);
            if (isNaN(val)) return 0;
            switch(unit) {
                case 'MB': return val;
                case 'GB': return val * 1024;
                case 'TB': return val * 1024 * 1024;
                default: return 0;
            }
        };

        let convertFromMB = function(mb, unit) {
            if (typeof mb !== 'number') return '0';
            switch(unit) {
                case 'MB': return mb;
                case 'GB': return (mb / 1024);
                case 'TB': return (mb / 1024 / 1024);
                default: return mb;
            }
        };

        let sizeInput = E('input', {
            'type': 'text',
            'class': 'cbi-input-text',
            'id': 'resize_size',
            'placeholder': _('Enter new size'),
            'value': currentSizeGB,
            'data-max': maxSizeGB
        });

        let unitSelect = E('select', {
            'class': 'cbi-input-select',
            'id': 'resize_unit',
            'change': function() {
                let sizeInput = document.getElementById('resize_size');
                if (!sizeInput) return;

                let unit = unitSelect.value;
                let maxInUnit = convertFromMB(maxSizeMB, unit);
                sizeInput.setAttribute('data-max', maxInUnit);

                let currentVal = parseFloat(sizeInput.value);
                if (!isNaN(currentVal) && currentVal > maxInUnit) {
                    sizeInput.value = Number(maxInUnit).toFixed(2);
                }
            }
        }, [
            E('option', {'value': 'MB'}, 'MB'),
            E('option', {'value': 'GB', 'selected': 'selected'}, 'GB'),
            E('option', {'value': 'TB'}, 'TB')
        ]);

        ui.showModal(_('Resize Partition'), [
            E('div', {'class': 'cbi-section'}, [
                E('div', {'class': 'alert-message warning'}, [
                    E('strong', {}, _('Warning')),
                    E('br'),
                    _('Resizing a partition can cause data loss if not done correctly.'),
                    E('br'),
                    _('Please ensure you have a backup of important data before proceeding.')
                ]),
                E('div', {'class': 'cbi-section-descr'}, _('Resize partition /dev/%s').format(partName)),
                E('div', {'class': 'cbi-section'}, [
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('New size')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('div', {'class': 'size-input-group'}, [sizeInput, unitSelect]),
                            E('div', {'style': 'margin-top: 5px; font-size: 12px; color: var(--text-color-secondary)'}, [
                                E('div', {'style': 'margin-top: 1px;'}, 
                                    _('Current size: %s MB / %s GB / %s TB').format(
                                        currentSizeMB, 
                                        currentSizeGB, 
                                        currentSizeTB
                                    )),
                                E('div', {'style': 'margin-top: 1px;'}, 
                                    _('Available space: %s MB / %s GB / %s TB').format(
                                        availableSpaceMB, 
                                        availableSpaceGB, 
                                        availableSpaceTB
                                    )),
                                E('div', {'style': 'margin-top: 1px;'}, 
                                    _('Maximum size to be obtained: %s MB / %s GB / %s TB').format(
                                        maxSizeMB, 
                                        maxSizeGB, 
                                        maxSizeTB
                                    ))
                            ])
                        ])
                    ])
                ])
            ]),
            E('div', {'class': 'cbi-value'}, [
                E('label', {'class': 'cbi-value-title'}, _('All available space')),
                E('div', {'class': 'cbi-value-field'}, [
                    E('button', {
                        'id': 'use_max_resize',
                        'class': 'btn',
                        'click': function() {
                            let sizeInput = document.getElementById('resize_size');
                            let unitSelect = document.getElementById('resize_unit');
                            if (!sizeInput || !unitSelect) return;

                            let unit = unitSelect.value;
                            let maxInUnit = convertFromMB(maxSizeMB, unit);
                            sizeInput.value = Number(maxInUnit).toFixed(2);
                            sizeInput.setAttribute('data-max', maxInUnit);
                        }
                    }, _('Fill in size'))
                ])
            ]),

            E('div', {'style': 'display: flex; justify-content: space-between; align-items: center;'}, [
                E('div', {}, [
                    E('button', {'class': 'btn', 'click': ui.hideModal}, _('Cancel'))
                ]),

                E('div', {}, [
                    E('button', {
                        'class': 'cbi-button cbi-button-positive',
                        'click': ui.createHandlerFn(this, function() {
                            let newSizeValue = parseFloat(sizeInput.value);
                            let unit = unitSelect.value;

                            if (!newSizeValue || newSizeValue <= 0) {
                                ui.addNotification(null, E('p', _('Please enter a valid size')), 'warning');
                                return;
                            }

                            let newSizeBytes = newSizeValue;
                            if (unit === 'MB') newSizeBytes *= 1024 * 1024;
                            else if (unit === 'GB') newSizeBytes *= 1024 * 1024 * 1024;
                            else if (unit === 'TB') newSizeBytes *= 1024 * 1024 * 1024 * 1024;

                            if (newSizeBytes <= currentSize) {
                                ui.addNotification(null, E('p', _('New size must be larger than current size')), 'warning');
                                return;
                            }

                            if (newSizeBytes > maxSize) {
                                ui.addNotification(null, E('p', _('New size exceeds available space')), 'warning');
                                return;
                            }

                            ui.hideModal();
                            this.resizePartition(partName, newSizeValue, unit);
                        })
                    }, _('Resize'))
                ])
            ])
        ]);
    },

    resizePartition: async function(partition, newSize, unit) {
        const restorer = this.disableActiveButtonsAndRemember();
        try {
            let device = '/dev/' + partition;

            let result = await this.callRpcd('resize_partition', {
                partition: device,
                new_size: newSize.toString(),
                unit: unit
            });

            if (result.success && result.pid) {
                await this.monitorOperation(
                    result.pid,
                    _('Resizing partition...'),
                    _('Partition resized successfully'),
                    _('Failed to resize partition')
                );
            } else {
                throw new Error(result.error || _('Failed to start partition resize'));
            }

            this.refreshDiskView();
        } catch (err) {
            this.hideOperationStatus();
            console.error('resizePartition error:', err);
        } finally {
            try { restorer.restore(); } catch (e) { console.error('restore buttons failed', e); }
        }
    },

    showDeleteDialog: function() {
        if (!this.selectedPartition) {
            ui.addNotification(null, E('p', _('Please select a partition first')), 'warning');
            return;
        }

        if (this.isPartitionMounted(this.selectedPartition)) {
            ui.addNotification(null, E('p', _('Cannot delete mounted partition. Please unmount first.')), 'warning');
            return;
        }

        let partName = this.selectedPartition.name;

        ui.showModal(_('Delete Partition'), [
            E('div', {'class': 'cbi-section'}, [
                E('div', {'class': 'alert-message warning'}, [
                    E('strong', {}, _('Warning')),
                    E('br'),
                    _('This will delete partition /dev/%s and all its data!').format(partName)
                ]),
                E('p', {}, _('Are you sure you want to continue?'))
            ]),
            E('div', {'class': 'right'}, [
                E('button', {'class': 'btn', 'click': ui.hideModal}, _('Cancel')),
                ' ',
                E('button', {
                    'class': 'btn cbi-button-negative',
                    'click': ui.createHandlerFn(this, function() {
                        ui.hideModal();
                        this.deletePartition(partName);
                    })
                }, _('Delete'))
            ])
        ]);
    },

    deletePartition: function(partition) {
        let partitionPath = '/dev/' + partition;

        this.callRpcd('delete_partition', {
            partition: partitionPath
        }).then(result => {
            if (result.success && result.pid) {
                return this.monitorOperation(
                    result.pid,
                    _('Deleting partition...'),
                    _('Partition deleted successfully'),
                    _('Failed to delete partition')
                );
            } else {
                throw new Error(result.error || _('Failed to start partition deletion'));
            }
        }).then(() => {
            this.selectedPartition = null;
            this.refreshDiskView();
        }).catch(err => {
            this.hideOperationStatus();
            console.error('deletePartition error:', err);
        });
    },

    mountDisk: function() {
        if (!this.selectedPartition) {
            ui.addNotification(null, E('p', _('Please select a partition first')), 'warning');
            return;
        }

        let part = this.selectedPartition;
        let partPath = '/dev/' + part.name;
        let mountPoint = '/mnt/' + part.name;

        fs.exec('/bin/mkdir', ['-p', mountPoint]).then(() => {
            fs.exec('/bin/mount', [partPath, mountPoint]).then(res => {
                if (res.code === 0) {
                    this.popTimeout(null, E('p', _('Mounted to %s').format(mountPoint)), 5000, 'info');
                    this.refreshDiskView();
                } else {
                    ui.addNotification(null, E('p', _('Failed to mount: ') + res.stderr), 'error');
                }
            });
        });
    },

    unmountDisk: function() {
        if (!this.selectedPartition) {
            ui.addNotification(null, E('p', _('Please select a partition first')), 'warning');
            return;
        }

        let part = this.selectedPartition;

        if (!part.mountpoint) {
            ui.addNotification(null, E('p', _('Selected partition is not mounted')), 'warning');
            return;
        }

        fs.exec('/bin/umount', [part.mountpoint]).then(res => {
            if (res.code === 0) {
                this.popTimeout(null, E('p', _('Unmounted %s').format(part.mountpoint)), 5000, 'info');
                this.refreshDiskView();
            } else {
                ui.addNotification(null, E('p', _('Failed to unmount: ') + res.stderr), 'error');
            }
        });
    },

    refreshDiskView: function() {
        this.selectedPartition = null;
        this.selectedUnallocated = null;

        if (!this.selectedDisk) {
            let contentArea = document.getElementById('disk-content-area');
            if (contentArea) {
                contentArea.innerHTML = '';
                contentArea.appendChild(
                E('div', {'class': 'alert alert-information'}, 
                    _('Please select a disk to view its partitions')));
            }
            this.updateActionButtons();
            return;
        }

        let contentArea = document.getElementById('disk-content-area');
        if (!contentArea) return;

        contentArea.innerHTML = '';
        contentArea.appendChild(E('div', {'class': 'alert alert-info'}, 
            E('span', {'class': 'spinning'}, _('Loading disk information...'))));

        Promise.all([
            this.getDiskInfo(this.selectedDisk),
            this.getMountedPartitions()
        ]).then(results => {
            let diskInfo = results[0];
            this.mountedPartitions = results[1];
            this.diskData[this.selectedDisk] = diskInfo;

            let diskDetails = E('div', {'class': 'cbi-value'}, [
                E('div', { 
                    'class': 'cbi-value', 
                    'id': 'disk-info-compact',
                    'style': 'margin-bottom: 0.5em; text-align: right;'
                }, [
                    E('small', { 'style': 'font-size: 0.9em; color: var(--text-color-medium, #111);' }, [
                        _('Temperature') + ': ',
                        E('span', {}, [diskInfo.temperature || '-']),
                        ' | ' + _('S.M.A.R.T. Status') + ': ',
                        E('span', { 'style': 'color: ' + diskInfo.smartStatus.color }, 
                            [diskInfo.smartStatus.status]),
                        ' | ' + _('Mount Status') + ': ',
                        E('span', { 'style': 'color: ' + (this.hasAnyPartitionMounted(this.selectedDisk) ? 
                            'var(--app-mini-diskmanager-primary)' : 'var(--text-color-secondary)') }, 
                            [(this.hasAnyPartitionMounted(this.selectedDisk) ? _('Mounted') : _('Not mounted')).toUpperCase()])
                    ])
                ])
            ]);

            let partitionLayoutSection = E('div', {'class': 'partition-layout-section'}, [
                E('div', {'class': 'ifacebox', 'style': 'width:98%;table-layout:fixed;'}, [
                    E('div', {'class': 'ifacebox-head', 'style': 'font-weight:bold;background:#f8f8f8;padding:8px;text-align:center;'}, 
                        _('Partition Layout')),
                    E('div', {'class': 'ifacebox-body'}, [
                        this.renderPartitionBar(diskInfo)
                    ])
                ])
            ]);

            contentArea.innerHTML = '';
            contentArea.appendChild(diskDetails);
            contentArea.appendChild(partitionLayoutSection);
            contentArea.appendChild(E('h3', {'class': 'fade-in'}, _('Partitions')));
            contentArea.appendChild(E('div', {'class': 'partition-table-container'}, [
                this.renderPartitionTable(diskInfo)
            ]));

            this.updateActionButtons();
        }).catch(err => {
            console.log('refreshDiskView error:', err);
            contentArea.innerHTML = '';
            contentArea.appendChild(E('div', {'class': 'alert alert-danger'}, 
                _('Error loading disk information: ') + (err.message || err.toString())));
            this.updateActionButtons();
        });
    },

    handleSaveApply: null,
    handleSave: null,
    handleReset: null
});
