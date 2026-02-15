#
# Copyright 2025-2026 Rafał Wabik - IceG - From eko.one.pl forum
#
# MIT License.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-mini-diskmanager
PKG_VERSION:=1.0.29
PKG_RELEASE:=20260215
LUCI_TITLE:=LuCI JS Support for Mini Disk Manager
MAINTAINER:=Rafał Wabik <4Rafal@gmail.com>
LUCI_DESCRIPTION:=Interface for managing disk partitions and filesystems in OpenWrt.
LUCI_DEPENDS:=+luci-base +block-mount +fdisk +parted +lsblk
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature

