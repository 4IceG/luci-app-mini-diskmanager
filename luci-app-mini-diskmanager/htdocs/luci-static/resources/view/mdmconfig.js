'use strict';
'require view';
'require form';
'require rpc';
'require uci';
'require ui';
'require fs';

/*

  Copyright 2025-2026 Rafał Wabik - IceG - From eko.one.pl forum
  
  MIT License
  
*/

var callInitList = rpc.declare({
    object: 'luci',
    method: 'getInitList',
    params: ['name'],
    expect: { '': {} }
});

var pkg = {
    get Name() { return 'mini-diskmanager'; },
    get URL()  { return 'https://openwrt.org/packages/pkgdata/' + this.Name + '/'; },
    get pkgMgrURINew() { return 'admin/system/package-manager'; },
    get pkgMgrURIOld() { return 'admin/system/opkg'; },
    bestPkgMgrURI: function () {
        return L.resolveDefault(
            fs.stat('/www/luci-static/resources/view/system/package-manager.js'), null
        ).then(function (st) {
            if (st && st.type === 'file')
                return 'admin/system/package-manager';
            return L.resolveDefault(fs.stat('/usr/libexec/package-manager-call'), null)
                .then(function (st2) {
                    return st2 ? 'admin/system/package-manager' : 'admin/system/opkg';
                });
        }).catch(function () { return 'admin/system/opkg'; });
    },
    openInstallerSearch: function (query) {
        let self = this;
        return self.bestPkgMgrURI().then(function (uri) {
            let q = query ? ('?query=' + encodeURIComponent(query)) : '';
            window.open(L.url(uri) + q, '_blank', 'noopener');
        });
    },
    checkPackages: function() {
        return fs.exec_direct('/usr/bin/opkg', ['list-installed'], 'text')
            .catch(function () {
                return fs.exec_direct('/usr/libexec/opkg-call', ['list-installed'], 'text')
                    .catch(function () {
                        return fs.exec_direct('/usr/libexec/package-manager-call', ['list-installed'], 'text')
                            .catch(function () {
                                return '';
                            });
                    });
            })
            .then(function (data) {
                data = (data || '').trim();
                return data ? data.split('\n') : [];
            });
    },
    _isPackageInstalled: function(pkgName) {
        return this.checkPackages().then(function(installedPackages) {
            return installedPackages.some(function(pkg) {
                return pkg.includes(pkgName);
            });
        });
    }
};

return view.extend({
    load: function() {
        return Promise.resolve();
    },

    render: function() {
        var m, s, o;

        m = new form.Map('mdmconfig', _('Configuration'));

        s = m.section(form.TypedSection, 'filesystem', _('Disk Manager'));
        s.anonymous = true;
        s.addremove = false;

        s.tab('packages', _('Packages & Drivers'));
        s.tab('disklog', _('Mini Disk Manager log'));

        o = s.taboption('packages', form.DummyValue, '_dummy_drivers');
        o.rawhtml = true;
        o.render = function() {
            return E('div', {}, [
                E('h3', {}, _('Package and Driver Verification')),
                E('div', { 'class': 'cbi-map-descr' }, _('Check and install required drivers for storage devices.'))
            ]);
        };

        o = s.taboption('packages', form.Button, '_check_usb_drivers', _('Check USB drivers'));
        o.inputtitle = _('USB drivers');
        o.inputstyle = 'action';
        o.onclick = L.bind(function() {
            showPackageDialog('USB Drivers', {
                'USB Drivers': [
                    { name: 'kmod-usb-core', label: 'kmod-usb-core' },
                    { name: 'kmod-usb-storage', label: 'kmod-usb-storage' },
                    { name: 'kmod-usb-storage-uas', label: 'kmod-usb-storage-uas' },
                    { name: 'kmod-usb-storage-extras', label: 'kmod-usb-storage-extras' },
                    { name: 'kmod-usb2', label: 'kmod-usb2' },
                    { name: 'kmod-usb3', label: 'kmod-usb3' }
                ]
            });
        }, this);

        o = s.taboption('packages', form.Button, '_check_nvme_drivers', _('Check NVMe drivers'));
        o.inputtitle = _('NVMe drivers');
        o.inputstyle = 'action';
        o.onclick = L.bind(function() {
            showPackageDialog('NVMe Drivers', {
                'NVMe Drivers': [
                    { name: 'kmod-nvme', label: 'kmod-nvme' },
                    { name: 'libnvme', label: 'libnvme' }
                ]
            });
        }, this);

        o = s.taboption('packages', form.Button, '_check_ata_drivers', _('Check ATA/SATA drivers'));
        o.inputtitle = _('ATA/SATA drivers');
        o.inputstyle = 'action';
        o.onclick = L.bind(function() {
            showPackageDialog('ATA/SATA Drivers', {
                'ATA/SATA Drivers': [
                    { name: 'kmod-ata-core', label: 'kmod-ata-core' },
                    { name: 'kmod-ata-ahci', label: 'kmod-ata-ahci' },
                    { name: 'kmod-scsi-core', label: 'kmod-scsi-core' }
                ]
            });
        }, this);

        o = s.taboption('packages', form.DummyValue, '_dummy_smart');
        o.rawhtml = true;
        o.render = function() {
            return E('div', {}, [
                E('h3', {}, _('S.M.A.R.T. Data Reading')),
                E('div', { 'class': 'cbi-map-descr' }, _('Packages required to read S.M.A.R.T. disk data.'))
            ]);
        };

        o = s.taboption('packages', form.Button, '_check_smart_packages', _('Check S.M.A.R.T. packages'));
        o.inputtitle = _('S.M.A.R.T. tools');
        o.inputstyle = 'action';
        o.onclick = L.bind(function() {
            showPackageDialog('S.M.A.R.T. Data Reading', {
                'S.M.A.R.T. Tools': [
                    { name: 'smartmontools', label: 'smartmontools' },
                    { name: 'smartmontools-drivedb', label: 'smartmontools-drivedb' },
                    { name: 'nvme-cli', label: 'nvme-cli' }
                ]
            });
        }, this);

        o = s.taboption('packages', form.DummyValue, '_dummy_filesystems');
        o.rawhtml = true;
        o.render = function() {
            return E('div', {}, [
                E('h3', {}, _('Filesystem Support')),
                E('div', { 'class': 'cbi-map-descr' }, _('Packages required to support various file systems.'))
            ]);
        };

        o = s.taboption('packages', form.Button, '_check_linux_fs_packages', _('Check Linux filesystem packages'));
        o.inputtitle = _('Linux filesystems');
        o.inputstyle = 'action';
        o.onclick = L.bind(function() {
            showPackageDialog('Linux Filesystem Packages', {
                'Ext2/Ext3/Ext4': [
                    { name: 'kmod-fs-ext4', label: 'kmod-fs-ext4' },
                    { name: 'e2fsprogs', label: 'e2fsprogs' }
                ],
                'Expand Ext2/Ext3/Ext4': [
                    { name: 'resize2fs', label: 'resize2fs' },
                    { name: 'bc', label: 'bc' }
                ],
                'F2FS': [
                    { name: 'kmod-fs-f2fs', label: 'kmod-fs-f2fs' },
                    { name: 'mkf2fs', label: 'mkf2fs' },
                    { name: 'f2fsck', label: 'f2fsck' },
                    { name: 'f2fs-tools', label: 'f2fs-tools' }
                ],
                'Btrfs': [
                    { name: 'kmod-fs-btrfs', label: 'kmod-fs-btrfs' },
                    { name: 'btrfs-progs', label: 'btrfs-progs' }
                ]
            });
        }, this);

        o = s.taboption('packages', form.Button, '_check_windows_fs_packages', _('Check Windows filesystem packages'));
        o.inputtitle = _('Windows filesystems');
        o.inputstyle = 'action';
        o.onclick = L.bind(function() {
            showPackageDialog('Windows Filesystem Packages', {
                'FAT16/FAT32': [
                    { name: 'kmod-fs-vfat', label: 'kmod-fs-vfat' },
                    { name: 'kmod-nls-cp437', label: 'kmod-nls-cp437' },
                    { name: 'kmod-nls-iso8859-1', label: 'kmod-nls-iso8859-1' },
                    { name: 'dosfstools', label: 'dosfstools' }
                ],
                'NTFS': [
                    { name: 'ntfs-3g', label: 'ntfs-3g' },
                    { name: 'kmod-fs-ntfs3', label: 'kmod-fs-ntfs3' },
                    { name: 'ntfs-3g-utils', label: 'ntfs-3g-utils' },
                    { name: 'kmod-nls-utf8', label: 'kmod-nls-utf8' }
                ],
                'exFAT': [
                    { name: 'exfat-mkfs', label: 'exfat-mkfs' },
                    { name: 'kmod-fs-exfat', label: 'kmod-fs-exfat' },
                    { name: 'exfat-fsck', label: 'exfat-fsck' }
                ]
            });
        }, this);

        o = s.taboption('packages', form.DummyValue, '_dummy_diskwipe');
        o.rawhtml = true;
        o.render = function() {
            return E('div', {}, [
                E('h3', {}, _('Disk Wipe Support')),
                E('div', { 'class': 'cbi-map-descr' }, _('Packages required to support disk wiping functionality (clearing partition table).'))
            ]);
        };

        o = s.taboption('packages', form.Button, '_check_diskwipe_packages', _('Check Disk Wipe packages'));
        o.inputtitle = _('Disk Wipe');
        o.inputstyle = 'action';
        o.onclick = L.bind(function() {
            showPackageDialog('Disk Wipe Support', {
                'Disk Wipe (dd command)': [
                    { name: 'coreutils', label: 'coreutils (' + _('alternative') + ')' },
                    { name: 'coreutils-dd', label: 'coreutils-dd (' + _('alternative') + ')' }
                ]
            });
        }, this);

        function showPackageDialog(title, requiredPackages) {
            ui.showModal(_(title), [
                E('p', { 'class': 'spinning' }, _('Loading package data…'))
            ]);

            var isDiskWipeDialog = (title === 'Disk Wipe Support');
            
            var checkPromises = [pkg.checkPackages()];
            
            if (isDiskWipeDialog) {
                checkPromises.push(
                    L.resolveDefault(fs.stat('/bin/dd'), null).then(function(result) {
                        return (result && result.type === 'file');
                    })
                );
            }

            Promise.all(checkPromises).then(function(results) {
                var installedPackages = results[0];
                var ddExists = isDiskWipeDialog ? results[1] : false;

                var _isInstalled = function(pkgName) {
                    return installedPackages.some(function(pkg) {
                        return pkg.includes(pkgName);
                    });
                };

                var _row = function(pkgName, installed, isAlternative, ddAvailable) {
                    var title = E('label', { 'class': 'cbi-value-title' }, pkgName);
                    var btn;
                    
                    if (isAlternative && ddAvailable) {
                        btn = E('button', { 
                            'class': 'edit btn', 
                            'disabled': true
                        }, _('dd from BusyBox'));
                    } else if (installed) {
                        btn = E('button', { 'class': 'edit btn', 'disabled': true }, _('Installed'));
                    } else {
                        btn = E('button', {
                            'class': 'btn cbi-button-positive',
                            'click': function() { pkg.openInstallerSearch(pkgName); }
                        }, _('Install…'));
                    }

                    return E('div', { 'class': 'cbi-value' }, [
                        title,
                        E('div', { 'class': 'cbi-value-field' }, [ btn ])
                    ]);
                };

                var node = [];
                var sectionOrder = Object.keys(requiredPackages);

                sectionOrder.forEach(function(key) {
                    var pkgs = requiredPackages[key];
                    if (!pkgs || !pkgs.length) return;

                    if (sectionOrder.length > 1)
                        node.push(E('h4', {}, _(key)));

                    pkgs.forEach(function(p) {
                        var isAlternative = (p.name === 'coreutils' || p.name === 'coreutils-dd');
                        node.push(_row(p.label, _isInstalled(p.name), isAlternative, ddExists));
                    });
                });

                ui.showModal(_(title), [
                    E('div', {}, node),
                    E('div', { 'class': 'right' }, [
                        E('div', { 'class': 'btn cbi-button-neutral', 'click': ui.hideModal }, _('Close'))
                    ])
                ]);
            });
        }

        o = s.taboption('disklog', form.DummyValue, '_disklog');
        o.render = function() {
            var container = E('div', { 'class': 'cbi-section' }, [
                E('p', {}, _('Mini Disk Manager Log')),
                E('textarea', {
                    'id': 'diskmanager_log_output',
                    'class': 'cbi-input-textarea',
                    'style': 'width:100%; height:60vh; min-height:400px; white-space:pre; font-family:monospace;',
                    'readonly': true,
                    'wrap': 'off'
                }, '')
            ]);

            var textarea = container.querySelector('#diskmanager_log_output');

            function loadLog() {
                textarea.value = _('Loading log file…');
                fs.read('/tmp/mini-diskmanager.log').then(function(content) {
                    textarea.value = content || _('Log file is empty');
                }).catch(function(err) {
                    textarea.value = _('Unable to read log file') + ': ' + (err.message || err);
                });
            }

            loadLog();

            var controls = E('div', {
                'class': 'right',
                'style': 'margin-top:10px; display:flex; gap:0.5em; justify-content:flex-end; flex-wrap:wrap;'
            }, [
                E('button', {
                    'class': 'btn cbi-button-remove',
                    'click': function() {
                        fs.write('/tmp/mini-diskmanager.log', '')
                            .then(function() {
                                ui.addNotification(null, E('p', _('Log file cleared successfully')), 'info');
                                loadLog();
                            })
                            .catch(function(e) {
                                ui.addNotification(null, E('p', _('Unable to clear the file') + ': ' + e.message), 'error');
                            });
                    }
                }, _('Clear')),

                E('button', {
                    'class': 'cbi-button cbi-button-apply important',
                    'click': function() {
                        var blob = new Blob([textarea.value || ""], { type: 'text/plain' });
                        var link = document.createElement('a');
                        link.download = 'mini-diskmanager.log';
                        link.href = URL.createObjectURL(blob);
                        link.click();
                        URL.revokeObjectURL(link.href);
                    }
                }, _('Download')),

                E('button', {
                    'class': 'btn',
                    'click': function() { loadLog(); }
                }, _('Refresh'))
            ]);

            container.appendChild(controls);
            return container;
        };

        return m.render();
    },

    handleSaveApply: null,
    handleSave: null,
    handleReset: null
});
