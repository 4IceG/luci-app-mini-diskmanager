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
	--app-disks-info-dark-font-color: #2e2e2e;
	--app-disks-info-light-font-color: #fff;
	--app-disks-info-warn-color: #fff7e2;
	--app-disks-info-err-color: #fcc3bf;
	--app-disks-info-ok-color-label: #2ea256;
	--app-disks-info-err-color-label: #ff4e54;
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
	--partition-color-btrfs: rgba(255, 190, 92, 0.8);
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
	--app-disks-info-dark-font-color: #fff;
	--app-disks-info-light-font-color: #fff;
	--app-disks-info-warn-color: #8d7000;
	--app-disks-info-err-color: #a93734;
	--app-disks-info-ok-color-label: #007627;
	--app-disks-info-err-color-label: #a93734;
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
	--partition-color-btrfs: rgba(230, 180, 100, 0.8);
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
	flex-basis: 25%;
}

.controls > *:nth-child(4) {
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

.ifacebox {
    display: flex !important;
    flex-direction: column !important;
	min-width: 98% !important;
}

.ifacebox-body {
    flex: 1 !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.ifacebox-head port-label {
    width: 100% !important;
    box-sizing: border-box !important;
    font-weight: bold;
    position: relative;
    z-index: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0.25em 0.5em;
}

.disks-info-label-status {
	display: inline;
	margin: 0 4px !important;
	padding: 1px 4px;
	border-radius: 3px;
	text-transform: uppercase;
	font-weight: bold;
	line-height: 1.6em;
}

.disks-info-ok-label {
	background-color: var(--app-disks-info-ok-color-label) !important;
	color: var(--app-disks-info-light-font-color) !important;
}

.disks-info-err-label {
	background-color: var(--app-disks-info-err-color-label) !important;
	color: var(--app-disks-info-light-font-color) !important;
}

.disks-info-warn {
	background-color: var(--app-disks-info-warn-color) !important;
	color: var(--app-disks-info-dark-font-color) !important;
}

.disks-info-warn .td {
	color: var(--app-disks-info-dark-font-color) !important;
}

.disks-info-warn td {
	color: var(--app-disks-info-dark-font-color) !important;
}

.disks-info-err {
	background-color: var(--app-disks-info-err-color) !important;
	color: var(--app-disks-info-dark-font-color) !important;
}

.disks-info-err .td {
	color: var(--app-disks-info-dark-font-color) !important;
}

.disks-info-err td {
	color: var(--app-disks-info-dark-font-color) !important;
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
.partition-segment.btrfs { 
	background-color: var(--partition-color-btrfs);
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
    text-shadow: 0 1px 3px rgba(0,0,0,0.6);
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
.partition-color-indicator.btrfs { 
	background-color: var(--partition-color-btrfs); 
	border-color: rgba(255, 205, 130, 1);
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
	text-shadow: 0 1px 2px rgba(0,0,0,0.6);
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
.partition-inner-segment.btrfs { 
	background-color: var(--partition-color-btrfs);
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
    
    viewName: 'minidiskmanager',

    restoreSettingsFromLocalStorage: function() {
        let selectedDiskLocal = localStorage.getItem(`luci-app-${this.viewName}-selectedDisk`);
        if(selectedDiskLocal) {
            this.selectedDisk = selectedDiskLocal;
        }
    },

    saveSettingsToLocalStorage: function(diskName) {
        localStorage.setItem(`luci-app-${this.viewName}-selectedDisk`, diskName);
    },

    rpcCheckOperation: rpc.declare({
        object: 'minidiskmanager',
        method: 'check_operation',
        params: ['pid'],
        expect: {}
    }),

    rpcList: rpc.declare({
        object: 'minidiskmanager',
        method: 'list',
        params: [],
        expect: {}
    }),

    rpcCreatePartition: rpc.declare({
        object: 'minidiskmanager',
        method: 'create_partition',
        params: ['device', 'type', 'fstype', 'size', 'layout', 'label', 'reserved_space', 'reserved_unit'],
        expect: {}
    }),

    rpcDeletePartition: rpc.declare({
        object: 'minidiskmanager',
        method: 'delete_partition',
        params: ['device', 'partition'],
        expect: {}
    }),

    rpcFormatPartition: rpc.declare({
        object: 'minidiskmanager',
        method: 'format_partition',
        params: ['device', 'fstype', 'label', 'reserved_space', 'reserved_unit'],
        expect: {}
    }),

    rpcResizePartition: rpc.declare({
        object: 'minidiskmanager',
        method: 'resize_partition',
        params: ['partition', 'new_size', 'unit'],
        expect: {}
    }),

    rpcWipeDisk: rpc.declare({
        object: 'minidiskmanager',
        method: 'wipe_disk',
        params: ['device'],
        expect: {}
    }),

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

            if (has('btrfs-progs') && has('kmod-fs-btrfs')) {
                fsSet.add('btrfs');
            }

            if (has('dosfstools') && has('kmod-fs-vfat')) {
                fsSet.add('vfat');
            }
            
            if (has('ntfs-3g-utils') && (has('ntfs-3g') || has('kmod-fs-ntfs3'))) {
                fsSet.add('ntfs');
            }

            if (has('exfat-mkfs') && has('kmod-fs-exfat')) {
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
        this.restoreSettingsFromLocalStorage();
        
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
        const methodMap = {
            'check_operation': () => this.rpcCheckOperation(params.pid),
            'list': () => this.rpcList(),
            'create_partition': () => this.rpcCreatePartition(
                params.device,
                params.type,
                params.fstype,
                params.size,
                params.layout,
                params.label,
                params.reserved_space,
                params.reserved_unit
            ),
            'delete_partition': () => this.rpcDeletePartition(
                params.device,
                params.partition
            ),
            'format_partition': () => this.rpcFormatPartition(
                params.device,
                params.fstype,
                params.label,
                params.reserved_space,
                params.reserved_unit
            ),
            'resize_partition': () => this.rpcResizePartition(
                params.partition,
                params.new_size,
                params.unit
            ),
            'wipe_disk': () => this.rpcWipeDisk(params.device)
        };

        if (!methodMap[method]) {
            return Promise.reject(new Error(_('Unknown RPC method: ') + method));
        }

        return L.resolveDefault(methodMap[method](), null)
            .then(result => {
                if (result === null) {
                    return Promise.reject(new Error(_('RPC call failed: no response')));
                }
                return result;
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
                Promise.all([
                    L.resolveDefault(fs.exec('/usr/bin/lsblk', ['-J', '-b', '-o', 'NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT', '/dev/' + dev]), null),
                    this.getFullDiskModel(dev)
                ]).then(results => {
                    let lsblkResult = results[0];
                    let fullModel = results[1];
                    
                    if (lsblkResult && lsblkResult.code === 0) {
                        try {
                            let data = JSON.parse(lsblkResult.stdout);
                            if (data.blockdevices && data.blockdevices[0]) {
                                return {
                                    name: dev,
                                    path: '/dev/' + dev,
                                    size: data.blockdevices[0].size,
                                    model: fullModel || '',
                                    type: data.blockdevices[0].type
                                };
                            }
                        } catch (e) {
                            console.log('JSON parse error for ' + dev, e);
                        }
                    }
                    return { name: dev, path: '/dev/' + dev, size: 0, model: fullModel || '', type: 'disk' };
                })
            ));
        }).catch(err => {
            console.log('getBlockDevices error:', err);
            return [];
        });
    },

    getFullDiskModel: function(device) {
        return Promise.all([
            L.resolveDefault(fs.exec('/usr/sbin/smartctl', ['-i', '/dev/' + device]), null),
            L.resolveDefault(fs.exec('/usr/bin/lsblk', ['-dno', 'VENDOR,MODEL', '/dev/' + device]), null),
            L.resolveDefault(fs.read('/sys/block/' + device + '/device/vendor'), null),
            L.resolveDefault(fs.read('/sys/block/' + device + '/device/model'), null)
        ]).then(results => {
            let modelFamily = '';
            let model = '';
            let vendor = '';
            
            if (results[0] && results[0].code === 0) {
                let smartOutput = results[0].stdout;
                
                let modelFamilyMatch = smartOutput.match(/Model Family:\s*(.+)/i);
                if (modelFamilyMatch && modelFamilyMatch[1].trim()) {
                    modelFamily = modelFamilyMatch[1].trim();
                }
                
                let modelMatch = smartOutput.match(/(?:Device Model|Model Number|Product):\s*(.+)/i);
                if (modelMatch && modelMatch[1].trim()) {
                    model = modelMatch[1].trim();
                }
                
                let vendorMatch = smartOutput.match(/Vendor:\s*(.+)/i);
                if (vendorMatch && vendorMatch[1].trim()) {
                    vendor = vendorMatch[1].trim();
                }
                
                if (modelFamily && model) {
                    return modelFamily + ' ' + model;
                } else if (model) {
                    return model;
                } else if (modelFamily) {
                    return modelFamily;
                }
            }
            
            if (!model && !modelFamily) {
                if (results[1] && results[1].code === 0 && results[1].stdout.trim()) {
                    let lsblkOutput = results[1].stdout.trim();
                    let parts = lsblkOutput.split(/\s+/, 2);
                    
                    if (parts.length >= 2) {
                        if (parts[0] && parts[0] !== '') {
                            vendor = parts[0].trim();
                        }
                        if (parts[1] && parts[1] !== '') {
                            model = parts[1].trim();
                        }
                    } else if (parts.length === 1 && parts[0] && parts[0] !== '') {
                        model = parts[0].trim();
                    }
                }
            }
            
            if (!model && !vendor) {
                if (results[2] && results[2].trim()) {
                    vendor = results[2].trim();
                }
                if (results[3] && results[3].trim()) {
                    model = results[3].trim();
                }
            }
            
            if (vendor && model) {
                return vendor + ' ' + model;
            } else if (model) {
                return model;
            } else if (vendor) {
                return vendor;
            }
            
            return '';
        }).catch(err => {
            console.log('getFullDiskModel error for ' + device + ':', err);
            return '';
        });
    },

    removeDuplicateInDiskName: function(text) {
        if (!text || typeof text !== 'string') return text;
        
        let words = text.trim().split(/\s+/);
        let seen = new Set();
        let result = [];
        
        for (let word of words) {
            let wordLower = word.toLowerCase();
            if (!seen.has(wordLower)) {
                seen.add(wordLower);
                result.push(word);
            }
        }
        
        return result.join(' ');
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

    getSmartDeviceInfo: function(device) {
        const devicePath = '/dev/' + device;
        const diskType = this.getDiskType(device);

        if (diskType === 'nvme') {
            return L.resolveDefault(fs.exec('/usr/sbin/nvme', ['id-ctrl', devicePath]), null)
                .then(res => {
                    if (res && res.code === 0) {
                        const lines = res.stdout.split('\n');
                        const info = {};
                        
                        for (let line of lines) {
                            if (line.includes('mn ')) {
                                const match = line.match(/mn\s*:\s*(.+)/i);
                                if (match) info.model = match[1].trim();
                            }
                            if (line.includes('sn ')) {
                                const match = line.match(/sn\s*:\s*(.+)/i);
                                if (match) info.serial = match[1].trim();
                            }
                            if (line.includes('fr ')) {
                                const match = line.match(/fr\s*:\s*(.+)/i);
                                if (match) info.firmware = match[1].trim();
                            }
                        }
                        return info;
                    }
                    return null;
                })
                .catch(() => null);
        } else {
            // SATA/ATA
            const attempts = [
                ['-i', devicePath],
                ['-i', '-d', 'sat', devicePath],
                ['-i', '-d', 'ata', devicePath]
            ];

            let sequence = Promise.resolve(null);
            for (let i = 0; i < attempts.length; i++) {
                (function(args) {
                    sequence = sequence.then(function(found) {
                        if (found) return found;
                        return L.resolveDefault(fs.exec('/usr/sbin/smartctl', args), null)
                            .then(res => {
                                if (!res || res.code !== 0) return null;
                                
                                const lines = res.stdout.split('\n');
                                const info = {};
                                
                                for (let line of lines) {
                                    if (line.includes('Model Family:')) {
                                        const match = line.match(/Model Family:\s*(.+)/i);
                                        if (match) info.modelFamily = match[1].trim();
                                    }
                                    if (line.includes('Device Model:') || line.includes('Model Number:') || line.includes('Product:')) {
                                        const match = line.match(/(?:Device Model|Model Number|Product):\s*(.+)/i);
                                        if (match) info.model = match[1].trim();
                                    }
                                    if (line.includes('Serial Number:') || line.includes('Serial number:')) {
                                        const match = line.match(/Serial [Nn]umber:\s*(.+)/i);
                                        if (match) info.serial = match[1].trim();
                                    }
                                    if (line.includes('Firmware Version:') || line.includes('Revision:')) {
                                        const match = line.match(/(?:Firmware Version|Revision):\s*(.+)/i);
                                        if (match) info.firmware = match[1].trim();
                                    }
                                    if (line.includes('User Capacity:')) {
                                        const match = line.match(/User Capacity:\s*(.+)/i);
                                        if (match) info.capacity = match[1].trim();
                                    }
                                    if (line.includes('Sector Size:')) {
                                        const match = line.match(/Sector Size:\s*(.+)/i);
                                        if (match) info.sectorSize = match[1].trim();
                                    }
                                    if (line.includes('Rotation Rate:')) {
                                        const match = line.match(/Rotation Rate:\s*(.+)/i);
                                        if (match) info.rotationRate = match[1].trim();
                                    }
                                    if (line.includes('Form Factor:')) {
                                        const match = line.match(/Form Factor:\s*(.+)/i);
                                        if (match) info.formFactor = match[1].trim();
                                    }
                                    if (line.includes('ATA Version is:')) {
                                        const match = line.match(/ATA Version is:\s*(.+)/i);
                                        if (match) info.ataVersion = match[1].trim();
                                    }
                                    if (line.includes('SATA Version is:')) {
                                        const match = line.match(/SATA Version is:\s*(.+)/i);
                                        if (match) info.sataVersion = match[1].trim();
                                    }
                                }
                                
                                return Object.keys(info).length > 0 ? info : null;
                            });
                    });
                })(attempts[i]);
            }
            return sequence;
        }
    },

    getDiskType: function(device) {
        if (device.startsWith('nvme')) {
            return 'nvme';
        } else if (device.startsWith('sd') || device.startsWith('hd')) {
            return 'sata';
        } else if (device.startsWith('mmcblk')) {
            return 'mmc';
        }
        return 'unknown';
    },

    getDiskTemperature: function(device) {
    const devicePath = '/dev/' + device;
    const diskType = this.getDiskType(device);

    // NVMe
    if (diskType === 'nvme') {
        return L.resolveDefault(fs.exec('/usr/sbin/nvme', ['smart-log', devicePath, '-o', 'json']), null)
            .then(res => {
                if (res && res.code === 0) {
                    try {
                        const data = JSON.parse(res.stdout);
                        if (data.temperature !== undefined && data.temperature !== null) {
                            const tempC = data.temperature - 273;
                            if (tempC >= -50 && tempC <= 150) {
                                return tempC + ' °C';
                            }
                        }
                        if (data.temperature_sensor_1 !== undefined && data.temperature_sensor_1 !== null) {
                            const tempC = data.temperature_sensor_1 - 273;
                            if (tempC >= -50 && tempC <= 150) {
                                return tempC + ' °C';
                            }
                        }
                    } catch (e) {
                        console.error('NVMe temperature parse error:', e);
                    }
                }
                return null;
            })
            .catch(() => null);
    }

    // SATA/ATA
    const runSmart = function(args) {
        return L.resolveDefault(fs.exec('/usr/sbin/smartctl', args), null);
    };

    const attempts = [
        ['--json=c', '-A', devicePath],
        ['--json=c', '-A', '-d', 'sat', devicePath],
        ['--json=c', '-A', '-d', 'ata', devicePath]
    ];

    const extractFromJson = function(jsonText) {
        if (!jsonText) return null;
        try {
            const obj = (typeof jsonText === 'string') ? JSON.parse(jsonText) : jsonText;

            if (obj.temperature && typeof obj.temperature === 'object' && obj.temperature.current !== undefined && obj.temperature.current !== null) {
                const temp = parseInt(obj.temperature.current);
                if (!isNaN(temp) && temp > 0 && temp < 200) {
                    return temp + ' °C';
                }
            }

            if (obj.ata_smart_attributes && Array.isArray(obj.ata_smart_attributes.table)) {
                for (let i = 0; i < obj.ata_smart_attributes.table.length; i++) {
                    const attr = obj.ata_smart_attributes.table[i];
                    if (!attr || (attr.id !== 194 && !(attr.name && /temp/i.test(attr.name)))) continue;
                    
                    if (attr.value !== undefined && attr.value !== null) {
                        const temp = parseInt(attr.value);
                        if (!isNaN(temp) && temp > 0 && temp < 200) {
                            return temp + ' °C';
                        }
                    }
                    
                    if (attr.raw && typeof attr.raw === 'object' && attr.raw.string) {
                        const match = String(attr.raw.string).match(/(\d{1,3})/);
                        if (match) {
                            const temp = parseInt(match[1]);
                            if (!isNaN(temp) && temp > 0 && temp < 200) {
                                return temp + ' °C';
                            }
                        }
                    }
                    
                    if (attr.raw && typeof attr.raw === 'string') {
                        const match = attr.raw.match(/(\d{1,3})/);
                        if (match) {
                            const temp = parseInt(match[1]);
                            if (!isNaN(temp) && temp > 0 && temp < 200) {
                                return temp + ' °C';
                            }
                        }
                    }
                }
            }

            if (obj.temperature !== undefined && obj.temperature !== null && typeof obj.temperature === 'number') {
                const temp = parseInt(obj.temperature);
                if (!isNaN(temp) && temp > 0 && temp < 200) {
                    return temp + ' °C';
                }
            }

            if (obj['temperature.current'] || obj['Temperature'] || obj['temp']) {
                const v = obj['temperature.current'] || obj['Temperature'] || obj['temp'];
                if (typeof v === 'number') {
                    const temp = parseInt(v);
                    if (!isNaN(temp) && temp > 0 && temp < 200) {
                        return temp + ' °C';
                    }
                }
                if (typeof v === 'string') {
                    const match = String(v).match(/(\d{1,3})/);
                    if (match) {
                        const temp = parseInt(match[1]);
                        if (!isNaN(temp) && temp > 0 && temp < 200) {
                            return temp + ' °C';
                        }
                    }
                }
            }

            if (obj['nvme_smart_health'] && obj['nvme_smart_health'].temperature !== undefined && obj['nvme_smart_health'].temperature !== null) {
                const temp = parseInt(obj['nvme_smart_health'].temperature);
                if (!isNaN(temp) && temp > 0 && temp < 200) {
                    return temp + ' °C';
                }
            }

            if (obj.smart_status && obj.smart_status.temperature !== undefined && obj.smart_status.temperature !== null) {
                const temp = parseInt(obj.smart_status.temperature);
                if (!isNaN(temp) && temp > 0 && temp < 200) {
                    return temp + ' °C';
                }
            }

        } catch (e) {
            console.error('Temperature extraction error:', e);
            return null;
        }
        return null;
    };

    let sequence = Promise.resolve(null);
    for (let ai = 0; ai < attempts.length; ai++) {
        (function(args) {
            sequence = sequence.then(function(found) {
                if (found) return found;
                return runSmart(args).then(function(res) {
                    if (!res || res.code !== 0) return null;

                    const fromJson = extractFromJson(res.stdout);
                    if (fromJson) return fromJson;

                    const out = res.stdout || '';
                    const rx1 = out.match(/(?:Current Drive Temperature|Temperature|Drive Temperature|Temp)[^\\d\\n\\r]{0,6}([0-9]{1,3})/i);
                    if (rx1 && rx1[1]) return rx1[1] + ' °C';

                    const rx2 = out.match(/([0-9]{1,3})\s*°\s*C/i);
                    if (rx2 && rx2[1]) return rx2[1] + ' °C';

                    const rx3 = out.match(/:?\s*([\d]{1,3})\s+C\b/);
                    if (rx3 && rx3[1]) return rx3[1] + ' °C';

                    const lines = out.split('\n');
                    for (let li = 0; li < lines.length; li++) {
                        const line = lines[li];
                        if (/Temperature_Celsius/i.test(line)) {
                            const parts = line.trim().split(/\s+/);
                            if (parts.length > 0) {
                                for (let pi = parts.length - 1; pi >= 0; pi--) {
                                    if (/^\d{1,3}$/.test(parts[pi])) {
                                        const tempVal = parseInt(parts[pi]);
                                        if (tempVal > 0 && tempVal < 200) {
                                            return tempVal + ' °C';
                                        }
                                    }
                                }
                            }
                        }
                    }

                    return null;
                }).catch(function() { return null; });
            });
        })(attempts[ai]);
    }

    return sequence.catch(function() { return null; });
},

    getSmartStatus: function(device) {
        const devicePath = '/dev/' + device;
        const diskType = this.getDiskType(device);

        // NVMe
        if (diskType === 'nvme') {
            return L.resolveDefault(fs.exec('/usr/sbin/nvme', ['smart-log', devicePath, '-o', 'json']), null)
                .then(res => {
                    if (res && res.code === 0) {
                        try {
                            const data = JSON.parse(res.stdout);
                            if (data.critical_warning !== undefined) {
                                if (data.critical_warning === 0) {
                                    return { status: _('PASSED'), color: 'var(--app-mini-diskmanager-primary)' };
                                } else {
                                    return { status: _('WARNING'), color: 'var(--app-mini-diskmanager-warning)' };
                                }
                            }
                            if (data.media_errors !== undefined && data.media_errors > 0) {
                                return { status: _('ERRORS'), color: 'var(--app-mini-diskmanager-danger)' };
                            }
                            return { status: _('OK'), color: 'var(--app-mini-diskmanager-primary)' };
                        } catch (e) {
                            console.error('NVMe S.M.A.R.T. parse error:', e);
                        }
                    }
                    return { status: '-', color: 'var(--text-color-secondary)' };
                })
                .catch(() => ({ status: '-', color: 'var(--text-color-secondary)' }));
        }

        // SATA/ATA
        return L.resolveDefault(fs.exec('/usr/sbin/smartctl', ['-H', devicePath]), null)
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

    // Convert hours
    formatPowerOnTime: function(hours) {
        if (!hours || hours === 0) return '-';
        
        let totalHours = parseInt(hours);
        let days = Math.floor(totalHours / 24);
        let remainingHours = totalHours % 24;
        
        let years = Math.floor(days / 365);
        let remainingDays = days % 365;
        let months = Math.floor(remainingDays / 30);
        remainingDays = remainingDays % 30;
        
        let parts = [];
        if (years > 0) parts.push(years + ' ' + (years === 1 ? _('year') : _('years')));
        if (months > 0) parts.push(months + ' ' + (months === 1 ? _('month') : _('months')));
        if (remainingDays > 0) parts.push(remainingDays + ' ' + (remainingDays === 1 ? _('day') : _('days')));
        if (remainingHours > 0 && parts.length === 0) parts.push(remainingHours + ' ' + (remainingHours === 1 ? _('hour') : _('hours')));
        
        return parts.join(', ') || totalHours + ' ' + _('hours');
    },

    translateSmartAttribute: function(attrName) {
        const translations = {
            'Raw_Read_Error_Rate': _('Raw Read Error Rate'),
            'Throughput_Performance': _('Throughput Performance'),
            'Spin_Up_Time': _('Spin Up Time'),
            'Start_Stop_Count': _('Start Stop Count'),
            'Reallocated_Sector_Ct': _('Reallocated Sector Count'),
            'Seek_Error_Rate': _('Seek Error Rate'),
            'Seek_Time_Performance': _('Seek Time Performance'),
            'Power_On_Hours': _('Power On Hours'),
            'Spin_Retry_Count': _('Spin Retry Count'),
            'Calibration_Retry_Count': _('Calibration Retry Count'),
            'Power_Cycle_Count': _('Power Cycle Count'),
            'Read_Soft_Error_Rate': _('Read Soft Error Rate'),
            'Airflow_Temperature_Cel': _('Airflow Temperature'),
            'Temperature_Celsius': _('Temperature Celsius'),
            'Hardware_ECC_Recovered': _('Hardware ECC Recovered'),
            'Current_Pending_Sector': _('Current Pending Sector'),
            'Offline_Uncorrectable': _('Offline Uncorrectable'),
            'UDMA_CRC_Error_Count': _('UDMA CRC Error Count'),
            'Multi_Zone_Error_Rate': _('Multi Zone Error Rate'),
            'Wear_Leveling_Count': _('Wear Leveling Count'),
            'Used_Rsvd_Blk_Cnt_Tot': _('Used Reserved Block Count Total'),
            'Used_Rsvd_Blk_Cnt_Chip': _('Used Reserved Block Count Chip'),
            'Unused_Rsvd_Blk_Cnt_Tot': _('Unused Reserved Block Count Total'),
            'Program_Fail_Cnt_Total': _('Program Fail Count Total'),
            'Erase_Fail_Count_Total': _('Erase Fail Count Total'),
            'Runtime_Bad_Block': _('Runtime Bad Block'),
            'Uncorrectable_Error_Cnt': _('Uncorrectable Error Count'),
            'Temperature_Exceed_Cnt': _('Temperature Exceed Count'),
            'Erase_Fail_Count': _('Erase Fail Count'),
            'Reported_Uncorrect': _('Reported Uncorrectable Errors'),
            'High_Fly_Writes': _('High Fly Writes'),
            'Airflow_Temperature': _('Airflow Temperature'),
            'G_Sense_Error_Rate': _('G-Sense Error Rate'),
            'G-Sense_Error_Rate': _('G-Sense Error Rate'),
            'Power_Off_Retract_Count': _('Power-Off Retract Count'),
            'Power-Off_Retract_Count': _('Power-Off Retract Count'),
            'Load_Cycle_Count': _('Load Cycle Count'),
            'Temperature_Case': _('Temperature Case'),
            'Reallocated_Event_Count': _('Reallocated Event Count'),
            'Transfer_Error_Rate': _('Transfer Error Rate'),
            'Free_Fall_Sensor': _('Free Fall Sensor'),
            'Total_LBAs_Written': _('Total LBAs Written'),
            'Total_LBAs_Read': _('Total LBAs Read'),
            'Read_Error_Retry_Rate': _('Read Error Retry Rate'),
            'Min_W/E_Cycle': _('Minimum W/E Cycle'),
            'Max_W/E_Cycle': _('Maximum W/E Cycle'),
            'Average_W/E_Cycle': _('Average W/E Cycle'),
            'Media_Wearout_Indicator': _('Media Wearout Indicator'),
            'Available_Reservd_Space': _('Available Reserved Space'),
            'SSD_Life_Left': _('SSD Life Left'),
            'Remaining_Lifetime_Perc': _('Remaining Lifetime Percentage'),
            'Percentage_Lifetime_Remain': _('Percentage Lifetime Remaining'),
            'Remaining_Life': _('Remaining Life'),
            'Lifetime_Writes_GiB': _('Lifetime Writes GiB'),
            'Lifetime_Reads_GiB': _('Lifetime Reads GiB'),
            'Available_Reserved_Space': _('Available Reserved Space'),
            'Program_Fail_Count': _('Program Fail Count'),
            'Erase_Fail_Count': _('Erase Fail Count'),
            'Unexpected_Power_Loss_Ct': _('Unexpected Power Loss Count'),
            'Thermal_Throttle_Status': _('Thermal Throttle Status'),
            'End_to_End_Error': _('End-to-End Error'),
            'End-to-End_Error': _('End-to-End Error'),
            'Workld_Host_Reads_Perc': _('Workload Host Reads Percentage'),
            'Workld_Media_Wear_Indic': _('Workload Media Wear Indicator'),
            'Timed_Workld_Media_Wear': _('Timed Workload Media Wear'),
            'Workload_Timer': _('Workload Timer'),
            'Perc_Rated_Life_Used': _('Percentage Rated Life Used'),
            'Head_Flying_Hours': _('Head Flying Hours'),
            'Read_Channel_Margin': _('Read Channel Margin'),
            'Loaded_Hours': _('Loaded Hours'),
            'Load_Unload_Retry_Count': _('Load/Unload Retry Count'),
            'Load/Unload_Retry_Count': _('Load/Unload Retry Count'),
            'GMR_Head_Amplitude': _('GMR Head Amplitude'),
            'Drive_Temperature': _('Drive Temperature'),
            'Endurance_Remaining': _('Endurance Remaining'),
            'Power_On_Hours_and_Msec': _('Power On Hours and Milliseconds'),
            'Head_Health': _('Head Health'),
            'POR_Recovery_Count': _('POR Recovery Count'),
            'Unused_Reserve_NAND_Blk': _('Unused Reserve NAND Blocks'),
            'SSD_Protect_Mode': _('SSD Protect Mode'),
            'Host_Writes_32MiB': _('Host Writes 32MiB'),
            'NAND_Writes_32MiB': _('NAND Writes 32MiB'),
            'Remaining_Life_Left': _('Remaining Life Left'),
            'Grown_Bad_Block_Count': _('Grown Bad Block Count'),
            'Soft_Read_Error_Rate': _('Soft Read Error Rate'),
            'Data_Address_Mark_Errs': _('Data Address Mark Errors'),
            'Run_Out_Cancel': _('Run Out Cancel'),
            'Soft_ECC_Correction': _('Soft ECC Correction'),
            'TA_Increase_Count': _('TA Increase Count'),
            'Shock_Count_Write_Opern': _('Shock Count Write Operation'),
            'Shock_Rate_Write_Opern': _('Shock Rate Write Operation'),
            'Flying_Height': _('Flying Height'),
            'Spin_High_Current': _('Spin High Current'),
            'Spin_Buzz': _('Spin Buzz'),
            'Offline_Seek_Performnce': _('Offline Seek Performance'),
            'Vibration_During_Write': _('Vibration During Write'),
            'Shock_During_Write': _('Shock During Write'),
            'Disk_Shift': _('Disk Shift'),
            'Load_Retry_Count': _('Load Retry Count'),
            'Load_Friction': _('Load Friction'),
            'Load_In_Time': _('Load-in Time'),
            'Torque_Amplification_Count': _('Torque Amplification Count'),
            'Write_Error_Rate': _('Write Error Rate'),
            'Critical_Warning': _('Critical Warning'),
            'Percentage_Used': _('Percentage Used'),
            'Data_Units_Read': _('Data Units Read'),
            'Data_Units_Written': _('Data Units Written'),
            'Host_Read_Commands': _('Host Read Commands'),
            'Host_Write_Commands': _('Host Write Commands'),
            'Controller_Busy_Time': _('Controller Busy Time'),
            'Power_Cycles': _('Power Cycles'),
            'Unsafe_Shutdowns': _('Unsafe Shutdowns'),
            'Media_Errors': _('Media Errors'),
            'Error_Log_Entries': _('Error Log Entries')
        };
        if (translations[attrName]) {
            return translations[attrName];
        }
        return attrName.replace(/_/g, ' ');
    },

    translateDeviceInfoLabel: function(label) {
        const deviceLabels = {
            // SATA/ATA
            'Model Family': _('Model Family'),
            'Device Model': _('Device Model'),
            'Serial Number': _('Serial Number'),
            'Serial number': _('Serial Number'),
            'LU WWN Device Id': _('LU WWN Device Id'),
            'Firmware Version': _('Firmware Version'),
            'User Capacity': _('User Capacity'),
            'Capacity': _('Capacity'),
            'Sector Size': _('Sector Size'),
            'Sector Sizes': _('Sector Sizes'),
            'Rotation Rate': _('Rotation Rate'),
            'Form Factor': _('Form Factor'),
            'Device is': _('Device is'),
            'ATA Version is': _('ATA Version is'),
            'SATA Version is': _('SATA Version is'),
            'Local Time is': _('Local Time is'),
            'SMART support is': _('SMART support is'),
            'SMART Status': _('SMART Status'),
            'Device': _('Device'),
            // NVMe
            'Model Number': _('Model Number'),
            'Firmware Revision': _('Firmware Revision'),
            'PCI Vendor/Subsystem ID': _('PCI Vendor/Subsystem ID'),
            'IEEE OUI Identifier': _('IEEE OUI Identifier'),
            'Total NVM Capacity': _('Total NVM Capacity'),
            'Unallocated NVM Capacity': _('Unallocated NVM Capacity'),
            'Controller ID': _('Controller ID'),
            'Number of Namespaces': _('Number of Namespaces'),
            'Namespace 1 Size/Capacity': _('Namespace 1 Size/Capacity'),
            'Namespace 1 Formatted LBA Size': _('Namespace 1 Formatted LBA Size'),
            'Namespace 1 IEEE EUI-64': _('Namespace 1 IEEE EUI-64'),  
            // Plus
            'logical/physical': _('logical/physical'),
            'bytes': _('bytes'),
            'blocks': _('blocks'),
            'Solid State Device': _('Solid State Device')
        };
        
        return deviceLabels[label] || label;
    },

    getDetailedSmartInfo: function(device) {
        const devicePath = '/dev/' + device;
        const diskType = this.getDiskType(device);

        if (diskType === 'nvme') {
            // NVMe
            return L.resolveDefault(fs.exec('/usr/sbin/nvme', ['smart-log', devicePath, '-o', 'json']), null)
                .then(res => {
                    if (res && res.code === 0) {
                        try {
                            const data = JSON.parse(res.stdout);
                            
                            const safeNumber = (val, defaultVal = 0) => {
                                if (val === undefined || val === null) return defaultVal;
                                const num = typeof val === 'number' ? val : parseInt(val);
                                return isNaN(num) ? defaultVal : num;
                            };
                            
                            const criticalWarning = safeNumber(data.critical_warning, 0);
                            const availSpare = safeNumber(data.avail_spare, null);
                            const percentUsed = safeNumber(data.percent_used, null);
                            const unsafeShutdowns = safeNumber(data.unsafe_shutdowns, 0);
                            const mediaErrors = safeNumber(data.media_errors, 0);
                            const errorLogEntries = safeNumber(data.num_err_log_entries, 0);
                            
                            return {
                                type: 'nvme',
                                raw: data,
                                attributes: [
                                    {
                                        name: _('Critical Warning'),
                                        value: criticalWarning,
                                        status: (criticalWarning === 0) ? 'OK' : 'WARNING'
                                    },
                                    {
                                        name: _('Temperature'),
                                        value: data.temperature !== undefined ? (data.temperature - 273) + ' °C' : '-',
                                        status: 'INFO'
                                    },
                                    {
                                        name: _('Available Spare'),
                                        value: availSpare !== null ? availSpare + '%' : '-',
                                        status: availSpare !== null && availSpare >= 10 ? 'OK' : 'WARNING'
                                    },
                                    {
                                        name: _('Available Spare Threshold'),
                                        value: data.spare_thresh !== undefined ? data.spare_thresh + '%' : '-',
                                        status: 'INFO'
                                    },
                                    {
                                        name: _('Percentage Used'),
                                        value: percentUsed !== null ? percentUsed + '%' : '-',
                                        status: percentUsed !== null && percentUsed < 80 ? 'OK' : 'WARNING'
                                    },
                                    {
                                        name: _('Data Units Read'),
                                        value: data.data_units_read !== undefined ? data.data_units_read : '-',
                                        status: 'INFO'
                                    },
                                    {
                                        name: _('Data Units Written'),
                                        value: data.data_units_written !== undefined ? data.data_units_written : '-',
                                        status: 'INFO'
                                    },
                                    {
                                        name: _('Host Read Commands'),
                                        value: data.host_read_commands !== undefined ? data.host_read_commands : '-',
                                        status: 'INFO'
                                    },
                                    {
                                        name: _('Host Write Commands'),
                                        value: data.host_write_commands !== undefined ? data.host_write_commands : '-',
                                        status: 'INFO'
                                    },
                                    {
                                        name: _('Controller Busy Time'),
                                        value: data.controller_busy_time !== undefined ? data.controller_busy_time : '-',
                                        status: 'INFO'
                                    },
                                    {
                                        name: _('Power Cycles'),
                                        value: data.power_cycles !== undefined ? data.power_cycles : '-',
                                        status: 'INFO'
                                    },
                                    {
                                        name: _('Power On Hours'),
                                        value: data.power_on_hours !== undefined ? data.power_on_hours : '-',
                                        status: 'INFO'
                                    },
                                    {
                                        name: _('Unsafe Shutdowns'),
                                        value: unsafeShutdowns,
                                        status: unsafeShutdowns > 100 ? 'WARNING' : 'INFO'
                                    },
                                    {
                                        name: _('Media Errors'),
                                        value: mediaErrors,
                                        status: mediaErrors > 0 ? 'ERROR' : 'OK'
                                    },
                                    {
                                        name: _('Error Log Entries'),
                                        value: errorLogEntries,
                                        status: errorLogEntries > 0 ? 'WARNING' : 'OK'
                                    }
                                ]
                            };
                        } catch (e) {
                            console.error('Parse NVMe S.M.A.R.T. error:', e);
                            return null;
                        }
                    }
                    return null;
                })
                .catch(err => {
                    console.error('NVMe S.M.A.R.T. fetch error:', err);
                    return null;
                });
        } else {
            // SATA/ATA
            return L.resolveDefault(fs.exec('/usr/sbin/smartctl', ['-A', '-j', devicePath]), null)
                .then(res => {
                    if (res && res.code === 0) {
                        try {
                            const data = JSON.parse(res.stdout);
                            let attributes = [];
                            
                            if (data.ata_smart_attributes && Array.isArray(data.ata_smart_attributes.table)) {
                                attributes = data.ata_smart_attributes.table
                                    .filter(attr => attr && attr.id !== undefined)
                                    .map(attr => {
                                        let status = 'INFO';
                                        const attrValue = attr.value !== undefined ? attr.value : null;
                                        const attrThresh = attr.thresh !== undefined ? attr.thresh : null;
                                        const attrWorst = attr.worst !== undefined ? attr.worst : null;
                                        
                                        if (attrThresh !== null && attrValue !== null && attrValue < attrThresh) {
                                            status = 'ERROR';
                                        } else if (attrWorst !== null && attrValue !== null && attrValue < attrWorst + 10) {
                                            status = 'WARNING';
                                        } else if (attrValue !== null && attrValue >= 100) {
                                            status = 'OK';
                                        }

                                        let rawValue = '-';
                                        if (attr.raw !== undefined) {
                                            if (typeof attr.raw === 'object' && attr.raw !== null) {
                                                if (attr.raw.string !== undefined) {
                                                    rawValue = attr.raw.string;
                                                } else if (attr.raw.value !== undefined) {
                                                    rawValue = attr.raw.value;
                                                }
                                            } else if (attr.raw !== null) {
                                                rawValue = attr.raw;
                                            }
                                        }

                                        return {
                                            id: attr.id,
                                            name: attr.name || 'Unknown_Attr_' + attr.id,
                                            value: attrValue !== null ? attrValue : '-',
                                            worst: attrWorst !== null ? attrWorst : '-',
                                            thresh: attrThresh !== null ? attrThresh : '-',
                                            raw: rawValue,
                                            status: status
                                        };
                                    });
                            }

                            return {
                                type: 'sata',
                                raw: data,
                                attributes: attributes
                            };
                        } catch (e) {
                            console.error('Parse SATA S.M.A.R.T. error:', e);
                            return null;
                        }
                    }
                    return null;
                })
                .catch(err => {
                    console.error('SATA S.M.A.R.T. fetch error:', err);
                    return null;
                });
        }
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
            'btrfs': 'Btrfs',
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
            'btrfs': 'rgba(255, 99, 25, 0.8)',
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
                'btrfs': 'rgba(204, 79, 20, 0.8)',
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
        if (fstype !== 'ext2' && fstype !== 'ext3' && fstype !== 'ext4' && fstype !== 'btrfs') {
            return false;
        }

        if (fstype !== 'btrfs' && this.isPartitionMounted(partition)) {
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
                this.saveSettingsToLocalStorage(ev.target.value);
                this.selectedDisk = ev.target.value;
                this.selectedPartition = null;
                this.selectedUnallocated = null;
                this.refreshDiskView();
            })
        }, [E('option', {'value': ''}, _('-- ' + _('Select a disk') + ' --'))]);

        devices.forEach(dev => {
            let sizeStr = dev.size ? ' - ' + this.formatSize(dev.size) : '';
            let modelStr = dev.model ? ' (' + this.removeDuplicateInDiskName(dev.model.trim()) + ')' : '';
            diskSelect.appendChild(E('option', {'value': dev.name}, '/dev/' + dev.name + sizeStr + modelStr));
        });

        if (this.selectedDisk && this.selectedDisk !== '') {
            let options = diskSelect.querySelectorAll('option');
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === this.selectedDisk) {
                    diskSelect.selectedIndex = i;
                    break;
                }
            }
        }

	let controls = E('div', {'class': 'controls'}, [
            E('div', {}, [
                E('label', {}, _('Disk') + ':'),
                E('span', {'class': 'control-group'}, [
                    diskSelect,
                    E('button', {
                        'class': 'btn cbi-button',
                        'click': ui.createHandlerFn(this, function() {
                            if (!this.selectedDisk || this.selectedDisk === '') {
                                window.location.reload();
                            } else {
                                this.refreshDiskView();
                            }
                        })
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
                E('label', {}, _('S.M.A.R.T. Status') + ':'),
                E('span', {'class': 'control-group'}, [
                    E('button', {
                        'id': 'btn-smart',
                        'class': 'btn cbi-button-action',
                        'click': ui.createHandlerFn(this, this.showSmartDialog),
                        'disabled': 'disabled'
                    }, _('Show'))
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

        if (this.selectedDisk && this.selectedDisk !== '') {
            setTimeout(() => {
                this.refreshDiskView();
            }, 0);
        }

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

                const allCheckboxes = document.querySelectorAll('input[name^="partition_select_"]');
                allCheckboxes.forEach(cb => cb.checked = false);

                if (alreadySelected) {
                    this.selectedUnallocated = null;
                    const noTableCheckbox = document.querySelector('input[name="unallocated_select"]');
                    if (noTableCheckbox) {
                        noTableCheckbox.checked = false;
                    }
                } else {
                    segment.classList.add('selected');
                    this.selectedUnallocated = {
                        size: diskSize,
                        start: 0,
                        end: diskSize,
                        index: 0
                    };
                    const noTableCheckbox = document.querySelector('input[name="unallocated_select"]');
                    if (noTableCheckbox) {
                        noTableCheckbox.checked = true;
                    }
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

                const allCheckboxes = document.querySelectorAll('input[name^="partition_select_"]');
                allCheckboxes.forEach(cb => cb.checked = false);

                if (alreadySelected) {
                    this.selectedUnallocated = null;
                    const noTableCheckbox = document.querySelector('input[name="unallocated_select"]');
                    if (noTableCheckbox) {
                        noTableCheckbox.checked = false;
                    }
                } else {
                    segment.classList.add('selected');
                    this.selectedUnallocated = {
                        size: totalSize,
                        start: 0,
                        end: totalSize,
                        index: 0
                    };
                    const noTableCheckbox = document.querySelector('input[name="unallocated_select"]');
                    if (noTableCheckbox) {
                        noTableCheckbox.checked = true;
                    }
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
        let unallocCounter = 0;

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

            if (isUnallocated) {
                segment.setAttribute('data-unallocated-index', unallocCounter);
            }

            if (!isUnallocated) {
                segment.addEventListener('click', (ev) => {
                    if (this.wipeAllEnabled) {
                        return;
                    }
                    
                    let partPath = this.getPartitionPath(diskInfo.device, part.number);
                    let partName = partPath.replace('/dev/', '');
                    let checkbox = document.querySelector('.partition-select-checkbox[data-partition="' + partName + '"]');
                    
                    if (checkbox && !checkbox.disabled) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('click'));
                    }
                }, false);
            } else {
                segment.addEventListener('click', (ev) => {
                    if (this.wipeAllEnabled) {
                        return;
                    }
                    
                    let unallocIndex = segment.getAttribute('data-unallocated-index');
                    let checkbox = document.querySelector('input[name="unallocated_select"][data-unallocated-index="' + unallocIndex + '"]');
                    
                    if (checkbox && !checkbox.disabled) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('click'));
                    }
                }, false);
            }

            // Magic 8%
            if (percentage < 8) {
                segment.setAttribute('title', partitionLabel + ' — ' + this.formatSize(part.size));
                barContainer.appendChild(segment);
                if (isUnallocated) {
                    unallocCounter++;
                }
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
                        
                        innerSegment.addEventListener('click', (ev) => {
                            ev.stopPropagation();
                            
                            if (this.wipeAllEnabled) {
                                return;
                            }
                            
                            let checkbox = document.querySelector('.partition-select-checkbox[data-partition="' + lp.name + '"]');
                            if (checkbox && !checkbox.disabled) {
                                checkbox.checked = !checkbox.checked;
                                checkbox.dispatchEvent(new Event('click'));
                            }
                        }, false);
                        
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
                                text-shadow: 0 1px 3px rgba(0,0,0,0.7);
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
            
            if (isUnallocated) {
                unallocCounter++;
            }
        }

        let typeLabels = {
            'primary': _('Primary'),
            'extended': _('Extended'),
            'logical': _('Logical'),
            'ext4': 'Ext4',
            'ext3': 'Ext3',
            'ext2': 'Ext2',
            'f2fs': 'F2FS',
            'btrfs': 'Btrfs',
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
                                let unallocCheckboxes = document.querySelectorAll('input[name="unallocated_select"]');
                                
                                if (this.wipeAllEnabled) {
                                    partCheckboxes.forEach(cb => {
                                        if (!cb.disabled) {
                                            cb.checked = true;
                                            cb.disabled = true;
                                        }
                                    });
                                    unallocCheckboxes.forEach(cb => {
                                        cb.checked = true;
                                        cb.disabled = true;
                                    });
                                } else {
                                    partCheckboxes.forEach(cb => {
                                        let isCriticalMount = cb.hasAttribute('data-critical-mount');
                                        cb.checked = false;
                                        cb.disabled = isCriticalMount;
                                    });
                                    unallocCheckboxes.forEach(cb => {
                                        cb.checked = false;
                                        cb.disabled = false;
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
                'class': 'unallocated-select-checkbox',
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
                    checkbox.setAttribute('data-critical-mount', 'true');
                }

                checkbox.addEventListener('click', function(ev) {
                    if (self.wipeAllEnabled) {
                        ev.preventDefault();
                        return;
                    }
                    
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
                            E('span', {}, indent + '⤷ ' + logPartitionName)
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
                            'class': 'unallocated-select-checkbox',
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
            ['btn-mount', 'btn-unmount', 'btn-smart', 'btn-create', 'btn-resize', 'btn-delete', 'btn-format', 'btn-wipe'].forEach(id => {
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
        let smartBtn = document.getElementById('btn-smart');
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

        if (smartBtn) {
            smartBtn.removeAttribute('disabled');
        }

        if (createBtn) {            
            if (this.wipeAllEnabled || (!hasUnallocated && !isExtendedSelected)) {
                createBtn.setAttribute('disabled', 'disabled');
            } else {
                createBtn.removeAttribute('disabled');
            }
        }

        if (resizeBtn) {
            if (this.wipeAllEnabled || !hasPartition || !this.canResizePartition(this.selectedPartition)) {
                resizeBtn.setAttribute('disabled', 'disabled');
            } else {
                resizeBtn.removeAttribute('disabled');
            }
        }

        if (deleteBtn) {
            if (isSelectedPartitionMounted || !hasPartition || hasUnallocated || this.wipeAllEnabled) {
                deleteBtn.setAttribute('disabled', 'disabled');
            } else {
                deleteBtn.removeAttribute('disabled');
            }
        }

        if (formatBtn) {
            if (isSelectedPartitionMounted || !hasPartition || hasUnallocated || isExtendedSelected || this.wipeAllEnabled) {
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

    showSmartDialog: function() {
        if (!this.selectedDisk) {
            ui.addNotification(null, E('p', _('Please select a disk first')), 'warning');
            return;
        }

        let devicePath = '/dev/' + this.selectedDisk;
        const diskType = this.getDiskType(this.selectedDisk);

        ui.showModal(_('S.M.A.R.T. Status') + ' - ' + devicePath, [
            E('div', {'class': 'cbi-section'}, [
                E('div', {'class': 'alert alert-info'}, [
                    E('span', {'class': 'spinning'}, _('Loading S.M.A.R.T. data...'))
                ])
            ])
        ]);

        Promise.all([
            this.getDetailedSmartInfo(this.selectedDisk),
            this.getSmartDeviceInfo(this.selectedDisk)
        ]).then(results => {
            const smartData = results[0];
            const deviceInfo = results[1];
            
            if (!smartData) {
                ui.showModal(_('S.M.A.R.T. Status') + ' - ' + devicePath, [
                    E('div', {'class': 'cbi-section'}, [
                        E('div', {'class': 'alert-message info'}, [
                            E('strong', {}, _('Information')),
                            E('br'),
                            _('Unable to read S.M.A.R.T. data.')
                        ])
                    ]),
                    E('div', {'class': 'right'}, [
                        E('button', {'class': 'btn', 'click': ui.hideModal}, _('Close'))
                    ])
                ]);
                return;
            }

            let content = [];
            
            if (deviceInfo && Object.keys(deviceInfo).length > 0) {
                let deviceInfoRows = [];
                
                if (deviceInfo.serial) {
                    deviceInfoRows.push(
                        E('div', {'style': 'display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px'}, [
                            E('span', {}, this.translateDeviceInfoLabel('Serial Number') + ':'),
                            E('span', {'style': 'font-weight:500'}, deviceInfo.serial)
                        ])
                    );
                }
                
                if (deviceInfo.firmware) {
                    deviceInfoRows.push(
                        E('div', {'style': 'display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px'}, [
                            E('span', {}, this.translateDeviceInfoLabel('Firmware Version') + ':'),
                            E('span', {'style': 'font-weight:500'}, deviceInfo.firmware)
                        ])
                    );
                }
                
                if (deviceInfo.capacity) {
                    deviceInfoRows.push(
                        E('div', {'style': 'display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px'}, [
                            E('span', {}, this.translateDeviceInfoLabel('Capacity') + ':'),
                            E('span', {'style': 'font-weight:500'}, deviceInfo.capacity)
                        ])
                    );
                }
                
                if (deviceInfo.sectorSize) {
                    deviceInfoRows.push(
                        E('div', {'style': 'display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px'}, [
                            E('span', {}, this.translateDeviceInfoLabel('Sector Size') + ':'),
                            E('span', {'style': 'font-weight:500'}, deviceInfo.sectorSize)
                        ])
                    );
                }
                
                if (deviceInfo.rotationRate) {
                    deviceInfoRows.push(
                        E('div', {'style': 'display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px'}, [
                            E('span', {}, this.translateDeviceInfoLabel('Rotation Rate') + ':'),
                            E('span', {'style': 'font-weight:500'}, deviceInfo.rotationRate)
                        ])
                    );
                }
                
                if (deviceInfo.formFactor) {
                    deviceInfoRows.push(
                        E('div', {'style': 'display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px'}, [
                            E('span', {}, this.translateDeviceInfoLabel('Form Factor') + ':'),
                            E('span', {'style': 'font-weight:500'}, deviceInfo.formFactor)
                        ])
                    );
                }
                
                if (deviceInfo.sataVersion) {
                    deviceInfoRows.push(
                        E('div', {'style': 'display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px'}, [
                            E('span', {}, this.translateDeviceInfoLabel('SATA Version is') + ':'),
                            E('span', {'style': 'font-weight:500'}, deviceInfo.sataVersion)
                        ])
                    );
                }
                
                if (deviceInfo.ataVersion) {
                    deviceInfoRows.push(
                        E('div', {'style': 'display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px'}, [
                            E('span', {}, this.translateDeviceInfoLabel('ATA Version is') + ':'),
                            E('span', {'style': 'font-weight:500'}, deviceInfo.ataVersion)
                        ])
                    );
                }
                
                if (deviceInfoRows.length > 0) {
                    let headerText = '';
                    if (deviceInfo.modelFamily && deviceInfo.model) {
                        headerText = this.removeDuplicateInDiskName(deviceInfo.modelFamily + ' ' + deviceInfo.model);
                    } else if (deviceInfo.model) {
                        headerText = this.removeDuplicateInDiskName(deviceInfo.model);
                    } else if (deviceInfo.modelFamily) {
                        headerText = this.removeDuplicateInDiskName(deviceInfo.modelFamily);
                    } else {
                        headerText = this.translateDeviceInfoLabel('Device');
                    }
                    
                    content.push(
                        E('div', {'class': 'ifacebox', 'style': 'margin:.25em 0 1em 0;width:100%'}, [
                            E('div', {'class': 'ifacebox-head port-label', 'style': 'font-weight:bold;padding:8px'}, [
                                headerText
                            ]),
                            E('div', {'class': 'ifacebox-body', 'style': 'padding:8px'}, deviceInfoRows)
                        ])
                    );
                }
            }

            // NVMe
            if (smartData.type === 'nvme') {
                let criticalWarning = smartData.raw.critical_warning !== undefined ? 
                    smartData.raw.critical_warning : 0;
                let statusLabel = criticalWarning === 0 ?
                    E('span', {'class': 'disks-info-label-status disks-info-ok-label'}, _('OK')) :
                    E('span', {'class': 'disks-info-label-status disks-info-err-label'}, _('WARNING'));

                content.push(E('h5', {
                    'style': 'width:100% !important; text-align:center !important; margin: 1em 0;'
                }, [
                    _('NVMe S.M.A.R.T. Health Status') + ': ',
                    statusLabel
                ]));

                let percentUsed = smartData.raw.percent_used !== undefined ? 
                    smartData.raw.percent_used : 0;
                let powerOnHours = smartData.raw.power_on_hours !== undefined ? 
                    smartData.raw.power_on_hours : 0;
                let powerOnTimeFormatted = this.formatPowerOnTime(powerOnHours);
                
                // Temp
                let temperature = '-';
                if (smartData.raw.temperature !== undefined && smartData.raw.temperature !== null) {
                    let tempC = smartData.raw.temperature - 273;
                    if (tempC >= -50 && tempC <= 150) {
                        temperature = tempC + ' °C';
                    }
                }
                
                let statusTableRows = [
                    E('tr', {'class': 'tr'}, [
                        E('td', {'class': 'td left', 'style': 'width: 33%;'}, [_('Power On Time')]),
                        E('td', {'class': 'td'}, [
                            E('div', {'style': 'text-align: left;'}, [
                                powerOnTimeFormatted,
                                E('span', {'style': 'color: var(--text-color-secondary); margin-left: 8px;'}, 
                                    '(' + powerOnHours + ' ' + _('hours') + ')')
                            ])
                        ])
                    ]),
                    E('tr', {'class': 'tr'}, [
                        E('td', {'class': 'td left', 'style': 'width: 33%;'}, [_('Temperature')]),
                        E('td', {'class': 'td'}, [
                            E('div', {'style': 'text-align: left;'}, [
                                temperature
                            ])
                        ])
                    ])
                ];
                
                if (percentUsed !== null && percentUsed !== undefined) {
                    statusTableRows.push(
                        E('tr', {'class': 'tr'}, [
                            E('td', {'class': 'td left', 'style': 'width: 33%;'}, [_('Disk Usage')]),
                            E('td', {'class': 'td'}, [
                                E('div', {'class': 'right'}, [
                                    E('div', {
                                        'class': 'cbi-progressbar',
                                        'title': percentUsed + '% ' + ' / ' + (100 - percentUsed) + '% '
                                    }, E('div', {
                                        'style': 'width:' + percentUsed + '%; background-color: ' +
                                            (percentUsed >= 95 ? 'var(--app-mini-diskmanager-danger)' :
                                             percentUsed >= 80 ? 'var(--app-mini-diskmanager-warning)' :
                                             'var(--app-mini-diskmanager-primary)') + ';'
                                    })),
                                ])
                            ])
                        ])
                    );
                }
                
                content.push(E('table', {'class': 'table', 'style': 'margin: 1em 0;'}, statusTableRows));

                // NVMe
                let nvmeTable = E('table', {
                    'class': 'table',
                    'style': 'width: 100%; font-size: 12px;'
                }, [
                    E('tr', {'class': 'tr table-titles'}, [
                        E('th', {'class': 'th left', 'style': 'width: 60%;'}, _('Attribute')),
                        E('th', {'class': 'th left', 'style': 'width: 40%;'}, _('Value'))
                    ])
                ]);

                for (let attr of smartData.attributes) {
                    if (!attr || !attr.name) continue;
                    
                    let lineStyle = 'tr';
                    if (attr.status === 'ERROR') {
                        lineStyle = 'tr disks-info-err';
                    } else if (attr.status === 'WARNING') {
                        lineStyle = 'tr disks-info-warn';
                    }

                    nvmeTable.appendChild(
                        E('tr', {'class': lineStyle}, [
                            E('td', {'class': 'td left'}, attr.name || _('Unknown')),
                            E('td', {'class': 'td left'}, 
                                attr.value !== undefined ? String(attr.value) : '-')
                        ])
                    );
                }

                content.push(
                    E('div', {'style': 'max-height: 45vh !important; overflow-y: auto !important;'}, [
                        nvmeTable
                    ])
                );

            } else {
                // SATA/ATA
                if (!smartData.attributes || smartData.attributes.length === 0) {
                    ui.showModal(_('S.M.A.R.T. Status') + ' - ' + devicePath, [
                        E('div', {'class': 'cbi-section'}, [
                            E('div', {'class': 'alert-message info'}, [
                                E('strong', {}, _('Information')),
                                E('br'),
                                _('No S.M.A.R.T. attributes found.')
                            ])
                        ]),
                        E('div', {'class': 'right'}, [
                            E('button', {'class': 'btn', 'click': ui.hideModal}, _('Close'))
                        ])
                    ]);
                    return;
                }

                let smartCriticalAttrs = [5, 11, 183, 184, 187, 196, 197, 198, 200, 202, 220];
                let smartTempAttrs = [190, 194];
                let diskTempWarning = 60;

                if (smartData.raw.temperature && smartData.raw.temperature.op_limit_max) {
                    diskTempWarning = smartData.raw.temperature.op_limit_max;
                }

                // Status SMART
                let smartStatusPassed = true;
                if (smartData.raw.smart_status && smartData.raw.smart_status.passed !== undefined) {
                    smartStatusPassed = smartData.raw.smart_status.passed;
                }
                
                let smartStatusLabel = smartStatusPassed ?
                    E('span', {'class': 'disks-info-label-status disks-info-ok-label'}, _('PASSED')) :
                    E('span', {'class': 'disks-info-label-status disks-info-err-label'}, _('FAILED'));

                content.push(E('h5', {
                    'style': 'width:100% !important; text-align:center !important; margin: 1em 0;'
                }, [
                    _('S.M.A.R.T. Health Status')+': ',
                    smartStatusLabel
                ]));

                let powerOnHours = 0;
                let temperature = '-';
                let wearPercent = null;
                
                if (smartData.raw.temperature && smartData.raw.temperature.current !== undefined) {
                    let tempValue = smartData.raw.temperature.current;
                    if (tempValue > 0 && tempValue < 200) {
                        temperature = tempValue + ' °C';
                    }
                }
                
                for (let attr of smartData.attributes) {
                    if (!attr || attr.id === undefined) continue;
                    
                    if (attr.id === 9 && attr.raw !== undefined && attr.raw !== '-') {
                        if (typeof attr.raw === 'number') {
                            powerOnHours = attr.raw;
                        } else if (typeof attr.raw === 'string') {
                            const parsed = parseInt(attr.raw);
                            if (!isNaN(parsed)) powerOnHours = parsed;
                        }
                    }
                    
                    if (temperature === '-' && attr.id === 194 && attr.raw !== undefined && attr.raw !== '-') {
                        let tempValue = 0;
                        if (typeof attr.raw === 'number') {
                            tempValue = attr.raw;
                        } else if (typeof attr.raw === 'string') {
                            const parsed = parseInt(attr.raw.split(' ')[0]);
                            if (!isNaN(parsed)) tempValue = parsed;
                        }
                        if (tempValue > 0 && tempValue < 200) {
                            temperature = tempValue + ' °C';
                        }
                    }
                    
                    if ((attr.id === 177 || attr.id === 233 || 
                        (attr.name && (attr.name.includes('Wear') || attr.name.includes('Wearout')))) &&
                        attr.value !== undefined && attr.value !== '-') {
                        const attrVal = typeof attr.value === 'number' ? attr.value : parseInt(attr.value);
                        if (!isNaN(attrVal)) {
                            wearPercent = 100 - attrVal;
                            if (wearPercent < 0) wearPercent = 0;
                            if (wearPercent > 100) wearPercent = 100;
                        }
                    }
                }
                
                let powerOnTimeFormatted = this.formatPowerOnTime(powerOnHours);
                
                let statusTableRows = [
                    E('tr', {'class': 'tr'}, [
                        E('td', {'class': 'td left', 'style': 'width: 33%;'}, [_('Power On Time')]),
                        E('td', {'class': 'td'}, [
                            E('div', {'style': 'text-align: left;'}, [
                                powerOnTimeFormatted,
                                E('span', {'style': 'color: var(--text-color-secondary); margin-left: 8px; font-size: 90%;'}, 
                                    '(' + powerOnHours + ' ' + _('hours') + ')')
                            ])
                        ])
                    ]),
                    E('tr', {'class': 'tr'}, [
                        E('td', {'class': 'td left', 'style': 'width: 33%;'}, [_('Temperature')]),
                        E('td', {'class': 'td'}, [
                            E('div', {'style': 'text-align: left;'}, [
                                temperature
                            ])
                        ])
                    ])
                ];
                
                if (wearPercent !== null) {
                    statusTableRows.push(
                        E('tr', {'class': 'tr'}, [
                            E('td', {'class': 'td left', 'style': 'width: 33%;'}, [_('Disk Wear Level')]),
                            E('td', {'class': 'td'}, [
                                E('div', {'class': 'right'}, [
                                    E('div', {
                                        'class': 'cbi-progressbar',
                                        'title': wearPercent.toFixed(1) + '% ' + _('worn') + ' / ' + (100 - wearPercent).toFixed(1) + '% ' + _('remaining')
                                    }, E('div', {
                                        'style': 'width:' + wearPercent + '%; background-color: ' +
                                            (wearPercent >= 95 ? 'var(--app-mini-diskmanager-danger)' :
                                             wearPercent >= 80 ? 'var(--app-mini-diskmanager-warning)' :
                                             'var(--app-mini-diskmanager-primary)') + ';'
                                    })),
                                    E('div', {'class': 'right'}, [
                                        E('div', {'style': 'text-align:center; font-size:90%;'}, [
                                            wearPercent.toFixed(1) + '% ' + _('worn') + ' / ' + (100 - wearPercent).toFixed(1) + '% ' + _('remaining')
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    );
                }
                
                content.push(E('table', {'class': 'table', 'style': 'margin: 1em 0;'}, statusTableRows));

                // SATA
                let smartAttrsTable = E('table', {
                    'class': 'table',
                    'style': 'width: 100%; font-size: 12px;'
                }, [
                    E('tr', {'class': 'tr table-titles'}, [
                        E('th', {'class': 'th right'}, _('Id')),
                        E('th', {'class': 'th left'}, _('Attribute')),
                        E('th', {'class': 'th left'}, _('Value')),
                        E('th', {'class': 'th left'}, _('Worst')),
                        E('th', {'class': 'th left'}, _('Thresh')),
                        E('th', {'class': 'th left'}, _('Raw'))
                    ])
                ]);

                for (let attr of smartData.attributes) {
                    if (!attr || attr.id === undefined) continue;
                    
                    let lineStyle = 'tr';
                    
                    if (attr.value !== undefined && attr.value !== '-' && 
                        attr.thresh !== undefined && attr.thresh !== '-') {
                        const attrValue = typeof attr.value === 'number' ? attr.value : parseInt(attr.value);
                        const attrThresh = typeof attr.thresh === 'number' ? attr.thresh : parseInt(attr.thresh);
                        if (!isNaN(attrValue) && !isNaN(attrThresh) && attrValue <= attrThresh) {
                            lineStyle = 'tr disks-info-err';
                        }
                    }
                    
                    if (lineStyle === 'tr' && smartCriticalAttrs.includes(attr.id)) {
                        let rawVal = 0;
                        if (typeof attr.raw === 'number') {
                            rawVal = attr.raw;
                        } else if (typeof attr.raw === 'string') {
                            rawVal = parseInt(attr.raw.split(' ')[0]) || 0;
                        }
                        
                        if (rawVal > 0) {
                            lineStyle = 'tr disks-info-warn';
                        }
                    }
                    
                    if (lineStyle === 'tr' && smartTempAttrs.includes(attr.id)) {
                        let tempValue = null;
                        if (typeof attr.raw === 'number') {
                            tempValue = attr.raw;
                        } else if (typeof attr.raw === 'string') {
                            const parsed = parseInt(attr.raw.split(' ')[0]);
                            if (!isNaN(parsed)) tempValue = parsed;
                        }
                        if (tempValue !== null && tempValue >= diskTempWarning) {
                            lineStyle = 'tr disks-info-warn';
                        }
                    }

                    smartAttrsTable.appendChild(
                        E('tr', {'class': lineStyle}, [
                            E('td', {'class': 'td right'}, String(attr.id || '-')),
                            E('td', {'class': 'td left'}, 
                                attr.name ? this.translateSmartAttribute(attr.name) : _('Unknown')),
                            E('td', {'class': 'td left'}, 
                                attr.value !== '-' && !isNaN(attr.value) ? 
                                    String(parseInt(attr.value)) : String(attr.value)),
                            E('td', {'class': 'td left'}, 
                                attr.worst !== '-' && !isNaN(attr.worst) ? 
                                    String(parseInt(attr.worst)) : String(attr.worst)),
                            E('td', {'class': 'td left'}, 
                                attr.thresh !== '-' && !isNaN(attr.thresh) ? 
                                    String(parseInt(attr.thresh)) : String(attr.thresh)),
                            E('td', {'class': 'td left'}, 
                                String(attr.raw !== undefined ? attr.raw : '-'))
                        ])
                    );
                }

                content.push(
                    E('div', {'style': 'max-height: 45vh !important; overflow-y: auto !important;'}, [
                        smartAttrsTable
                    ])
                );
            }

            ui.showModal(_('S.M.A.R.T. Status') + ' - ' + devicePath, [
                E('div', {'class': 'cbi-section'}, content),
                E('div', {'class': 'right'}, [
                    E('button', {'class': 'btn', 'click': ui.hideModal}, _('Close'))
                ])
            ]);

        }).catch(err => {
            console.error('S.M.A.R.T. dialog error:', err);
            ui.showModal(_('S.M.A.R.T. Status') + ' - ' + devicePath, [
                E('div', {'class': 'cbi-section'}, [
                    E('div', {'class': 'alert-message warning'}, [
                        E('strong', {}, _('Warning')),
                        E('br'),
                        _('Error reading S.M.A.R.T. data.')
                    ])
                ]),
                E('div', {'class': 'right'}, [
                    E('button', {'class': 'btn', 'click': ui.hideModal}, _('Close'))
                ])
            ]);
        });
    },

    showCreatePartitionDialog: function() {
        if (!this.selectedDisk) {
            ui.addNotification(null, E('p', _('Please select a disk first')), 'warning');
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
            const fsOptions = ['ext4', 'ext3', 'ext2', 'f2fs', 'btrfs', 'ntfs', 'vfat', 'exfat', 'swap'];

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
                                        let reservedSection = document.getElementById('reserved_space_section');
                                        if (this.value === 'extended') {
                                            fsTypeSelect.disabled = true;
                                            fsTypeSelect.value = '';
                                            labelInput.disabled = true;
                                            labelInput.value = '';
                                            if (reservedSection) {
                                                reservedSection.style.display = 'none';
                                            }
                                        } else {
                                            fsTypeSelect.disabled = false;
                                            labelInput.disabled = false;
                                            if (reservedSection && fsTypeSelect.value) {
                                                if (fsTypeSelect.value === 'ext2' || fsTypeSelect.value === 'ext3' || fsTypeSelect.value === 'ext4') {
                                                    reservedSection.style.display = '';
                                                } else {
                                                    reservedSection.style.display = 'none';
                                                }
                                            }
                                        }
                                    }
                                })
                            ])
                        ]),
                        E('div', {'class': 'cbi-value'}, [
                            E('label', {'class': 'cbi-value-title'}, _('File system')),
                            E('div', {'class': 'cbi-value-field'}, [
                                E('select', {
                                    'class': 'cbi-input-select', 
                                    'id': 'fs_type',
                                    'change': function() {
                                        let reservedSection = document.getElementById('reserved_space_section');
                                        if (reservedSection) {
                                            if (this.value === 'ext2' || this.value === 'ext3' || this.value === 'ext4') {
                                                reservedSection.style.display = '';
                                            } else {
                                                reservedSection.style.display = 'none';
                                            }
                                        }
                                    }
                                }, [
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
                        ]),
                        E('div', {'class': 'cbi-value', 'id': 'reserved_space_section', 'style': 'display: none;'}, [
                            E('label', {'class': 'cbi-value-title'}, _('Reserved space')),
                            E('div', {'class': 'cbi-value-field'}, [
                                E('div', {'class': 'size-input-group'}, [
                                    E('input', {
                                        'class': 'cbi-input-text',
                                        'id': 'reserved_space_value',
                                        'type': 'text',
                                        'value': '5',
                                        'placeholder': '5'
                                    }),
                                    E('select', {
                                        'class': 'cbi-input-select',
                                        'id': 'reserved_space_unit'
                                    }, [
                                        E('option', {'value': '%', 'selected': 'selected'}, '%'),
                                        E('option', {'value': 'MB'}, _('MB')),
                                        E('option', {'value': 'GB'}, _('GB')),
                                        E('option', {'value': 'TB'}, _('TB'))
                                    ])
                                ]),
                                E('div', {'style': 'margin-top: 5px; font-size: 12px; color: var(--text-color-secondary)'}, 
                                    _('Space reserved for root (default: 5%)'))
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
                    const preferred = ['ext4','ext3','ext2','f2fs','btrfs','vfat','ntfs','exfat','swap'];
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
                
                // Reserved space section
                const reservedSection = document.getElementById('reserved_space_section');
                if (reservedSection && fsSelect.value) {
                    if (fsSelect.value === 'ext2' || fsSelect.value === 'ext3' || fsSelect.value === 'ext4') {
                        reservedSection.style.display = '';
                    } else {
                        reservedSection.style.display = 'none';
                    }
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
                        
                        let reservedSpaceValue = document.getElementById('reserved_space_value').value.trim();
                        let reservedSpaceUnit = document.getElementById('reserved_space_unit').value;
                        let fstype = document.getElementById('fs_type').value;

                        ui.hideModal();

                        this.createPartition(
                            document.getElementById('part_part_type').value,
                            fstype,
                            document.getElementById('part_label').value,
                            size,
                            document.getElementById('part_layout').value,
                            reservedSpaceValue,
                            reservedSpaceUnit
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

    createPartition: async function(type, fstype, label, size, layout, reservedSpace, reservedUnit) {
        const restorer = this.disableAllButtonsAndRemember();
        try {
            if (!this.selectedDisk) {
                ui.addNotification(null, E('p', _('Please select a disk first')), 'warning');
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
                label: label || '',
                reserved_space: reservedSpace || '',
                reserved_unit: reservedUnit || ''
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
                        await this.formatPartition(lastPart.name, fstype, label, true, true, reservedSpace, reservedUnit);
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
                const preferred = ['ext4','ext3','ext2','f2fs','btrfs','vfat','ntfs','exfat','swap'];
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
                            E('select', {
                                'class': 'cbi-input-select', 
                                'id': 'format_fs_type',
                                'change': function() {
                                    let reservedSection = document.getElementById('format_reserved_space_section');
                                    if (reservedSection) {
                                        if (this.value === 'ext2' || this.value === 'ext3' || this.value === 'ext4') {
                                            reservedSection.style.display = '';
                                        } else {
                                            reservedSection.style.display = 'none';
                                        }
                                    }
                                }
                            }, fsOptions)
                        ])
                    ]),
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('Volume label')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('input', {'class': 'cbi-input-text', 'id': 'format_label', 'type': 'text', 
                                'placeholder': _('Optional')})
                        ])
                    ]),
                    E('div', {'class': 'cbi-value', 'id': 'format_reserved_space_section', 'style': 'display: none'}, [
                        E('label', {'class': 'cbi-value-title'}, _('Reserved space')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('div', {'class': 'size-input-group'}, [
                                E('input', {
                                    'class': 'cbi-input-text',
                                    'id': 'format_reserved_space_value',
                                    'type': 'text',
                                    'value': '5',
                                    'placeholder': '5'
                                }),
                                E('select', {
                                    'class': 'cbi-input-select',
                                    'id': 'format_reserved_space_unit'
                                }, [
                                    E('option', {'value': '%', 'selected': 'selected'}, '%'),
                                    E('option', {'value': 'MB'}, _('MB')),
                                    E('option', {'value': 'GB'}, _('GB')),
                                    E('option', {'value': 'TB'}, _('TB'))
                                ])
                            ]),
                            E('div', {'style': 'margin-top: 5px; font-size: 12px; color: var(--text-color-secondary)'}, 
                                _('Space reserved for root (default: 5%)'))
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
                            let reservedSpaceValue = document.getElementById('format_reserved_space_value').value.trim();
                            let reservedSpaceUnit = document.getElementById('format_reserved_space_unit').value;

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
                            this.formatPartition(partName, fstype, label, false, false, reservedSpaceValue, reservedSpaceUnit);
                        })
                    }, _('Format'))
                ])
            ]);
            
            // Reserved space section
            setTimeout(() => {
                const fsSelect = document.getElementById('format_fs_type');
                const reservedSection = document.getElementById('format_reserved_space_section');
                if (reservedSection && fsSelect && fsSelect.value) {
                    if (fsSelect.value === 'ext2' || fsSelect.value === 'ext3' || fsSelect.value === 'ext4') {
                        reservedSection.style.display = '';
                    } else {
                        reservedSection.style.display = 'none';
                    }
                }
            }, 100);
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

    formatPartition: async function(partition, fstype, label, skipModal, skipDisable, reservedSpace, reservedUnit) {
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
                label: label || '',
                reserved_space: reservedSpace || '',
                reserved_unit: reservedUnit || ''
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
        let defaultMountPoint = '/mnt/' + part.name;
        let fstype = part.filesystem || part.fstype || 'auto';
        
        ui.showModal(_('Mount Points - Mount Entry'), [
            E('div', {'class': 'cbi-section'}, [
                E('div', {'class': 'cbi-section'}, [
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('UUID')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('div', {'class': 'size-input-group'}, [
                                E('input', {
                                    'type': 'text',
                                    'class': 'cbi-input-text',
                                    'id': 'mount-uuid',
                                    'value': part.uuid || '',
                                    'readonly': true
                                })
                            ])
                        ])
                    ]),
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('Device')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('input', {
                                'type': 'text',
                                'class': 'cbi-input-text',
                                'id': 'mount-device',
                                'value': partPath,
                                'readonly': true
                            })
                        ])
                    ]),
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('Filesystem')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('input', {
                                'type': 'text',
                                'class': 'cbi-input-text',
                                'id': 'mount-fstype',
                                'value': fstype,
                                'readonly': true
                            })
                        ])
                    ]),
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('Mount point')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('select', {
                                'class': 'cbi-input-select',
                                'id': 'mount-target',
                                'change': function() {
                                    let inputCustom = document.getElementById('mount-target-custom');
                                    if (this.value === 'custom') {
                                        inputCustom.style.display = 'block';
                                        inputCustom.focus();
                                    } else {
                                        inputCustom.style.display = 'none';
                                    }
                                }
                            }, [
                                E('option', {'value': defaultMountPoint, 'selected': true}, defaultMountPoint),
                                E('option', {'value': '/'}, _('Use as root filesystem (/)')),
                                E('option', {'value': '/overlay'}, _('Use as external overlay (/overlay)')),
                                E('option', {'value': 'custom'}, _('-- custom --'))
                            ]),
                            E('input', {
                                'type': 'text',
                                'class': 'cbi-input-text',
                                'id': 'mount-target-custom',
                                'placeholder': _('Mount point'),
                                'style': 'margin-top: 0.5em; display: none'
                            })
                        ])
                    ]),
                    E('div', {'class': 'cbi-value'}, [
                        E('label', {'class': 'cbi-value-title'}, _('Mount options')),
                        E('div', {'class': 'cbi-value-field'}, [
                            E('input', {
                                'type': 'text',
                                'class': 'cbi-input-text',
                                'id': 'mount-options',
                                'placeholder': 'defaults',
                                'value': 'defaults'
                            }),
                            E('div', {'class': 'cbi-value-description'}, _('See "mount" manpage for details.'))
                        ])
                    ])
                ])
            ]),
            E('div', {'style': 'display: flex; justify-content: space-between; align-items: center;'}, [
                E('div', {}, [
                    E('button', {'class': 'btn', 'click': ui.hideModal}, _('Cancel'))
                ]),
                E('div', {}, [
                    E('button', {
                        'class': 'btn cbi-button-action',
                        'click': L.bind(function() {
                            var selectTarget = document.getElementById('mount-target');
                            var inputCustom = document.getElementById('mount-target-custom');
                            var target = selectTarget.value === 'custom' ? inputCustom.value : selectTarget.value;
                            var options = document.getElementById('mount-options').value || 'defaults';
                            
                            if (!target || target.trim() === '') {
                                ui.addNotification(null, E('p', _('Mount point cannot be empty')), 'error');
                                return;
                            }
                            
                            ui.hideModal();
                            
                            fs.exec('/bin/mkdir', ['-p', target]).then(L.bind(function() {
                                var args = [];
                                if (options && options !== 'defaults') {
                                    args.push('-o', options);
                                }
                                if (fstype && fstype !== 'auto') {
                                    args.push('-t', fstype);
                                }
                                args.push(partPath, target);
                                
                                return fs.exec('/bin/mount', args);
                            }, this)).then(L.bind(function(res) {
                                if (res.code === 0) {
                                    this.popTimeout(null, E('p', _('Mounted to %s').format(target)), 5000, 'info');
                                    this.refreshDiskView();
                                } else {
                                    ui.addNotification(null, E('p', _('Failed to mount: ') + res.stderr), 'error');
                                }
                            }, this)).catch(function(e) {
                                ui.addNotification(null, E('p', _('Mount failed: %s').format(e.message)), 'error');
                            });
                        }, this)
                    }, _('Mount'))
                ])
            ])
        ]);
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
                    'style': 'margin-bottom: 0.5em; text-align: left;'
                }, [
                    E('small', { 'style': 'font-size: 0.9em; color: var(--text-color-medium, #111);' }, [
                        _('Mount Status') + ': ',
                        E('span', { 'style': 'color: ' + (this.hasAnyPartitionMounted(this.selectedDisk) ? 
                            'var(--app-mini-diskmanager-primary)' : 'var(--text-color-secondary)') }, 
                            [(this.hasAnyPartitionMounted(this.selectedDisk) ? _('Mounted') : _('Not mounted')).toUpperCase()])
                    ])
                ])
            ]);

            let partitionLayoutSection = E('div', {'class': 'partition-layout-section'}, [
                E('div', {'class': 'ifacebox', 'style': 'width:98%;table-layout:fixed;'}, [
                    E('div', {
                        'class': 'ifacebox-head port-label', 
                        'style': 'font-weight:bold;padding:8px;text-align:center;',
                        'click': ui.createHandlerFn(this, function(ev) {
                            if (this.hasAnyPartitionMounted(this.selectedDisk)) {
                                return;
                            }  
                            let wipeCheckbox = document.getElementById('wipeall-checkbox');
                            if (wipeCheckbox && !wipeCheckbox.disabled) {
                                wipeCheckbox.checked = !wipeCheckbox.checked;
                                wipeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        })
                    }, _('Partition Layout')),
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
