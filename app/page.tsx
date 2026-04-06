"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Lock,
  Wallet,
  LogIn,
  Settings,
  UserPlus,
  CreditCard,
  Banknote,
} from "lucide-react";

const initialAccounts = [
  {
    id: 1,
    username: "demo1",
    password: "123456",
    balance: 100,
    withdrawCount: 0,
    canWithdraw: true,
    isFrozen: false,
    qrImage:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Page() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "demo1", password: "123456" });
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [adminInput, setAdminInput] = useState("admin123");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [message, setMessage] = useState(
    "这是一个反诈演示网页，所有余额均为虚拟演示数据，不可真实充值或提现。"
  );
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const currentUser = useMemo(
    () => accounts.find((a) => a.id === currentUserId) || null,
    [accounts, currentUserId]
  );

  const updateAccount = (id: number, patch: Partial<(typeof initialAccounts)[number]>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const handleLogin = () => {
    const user = accounts.find(
      (a) => a.username === loginForm.username && a.password === loginForm.password
    );
    if (!user) {
      setMessage("登录失败：账号或密码错误。此页面仅用于演示骗局常见界面。");
      return;
    }
    setCurrentUserId(user.id);
    setMessage("登录成功。注意：所谓‘登录送100元’本身就是常见诱导话术之一。");
  };

  const handleRechargeConfirm = () => {
    if (!currentUser) return;
    if (!rechargeAmount || Number(rechargeAmount) <= 0) {
      setMessage("请输入有效的演示充值金额。");
      return;
    }
    setShowRechargeModal(false);
    setShowImageModal(true);
    setMessage("下一步展示的是你预设的收款图片，用于演示‘扫码充值’骗局页面效果。请勿用于真实收款。");
  };

  const handleWithdraw = () => {
    if (!currentUser) return;
    if (currentUser.isFrozen) {
      setMessage("账户已被冻结。这正是诈骗页面常见的‘风控/审核/冻结’话术演示。");
      return;
    }
    if (!currentUser.canWithdraw) {
      setMessage("当前账户被设置为不可提现，用于演示后台可随意限制提现权的风险。");
      return;
    }
    if (currentUser.balance < 200) {
      setMessage("演示规则：余额未达到200元前，页面会诱导用户继续充值。这是典型风险信号。");
      return;
    }
    if (currentUser.withdrawCount >= 3) {
      updateAccount(currentUser.id, { isFrozen: true });
      setMessage("超过3次后已冻结。这个规则用于向家人演示‘多次小额提现后冻结’的常见套路。");
      return;
    }
    updateAccount(currentUser.id, {
      balance: Math.max(0, currentUser.balance - 10),
      withdrawCount: currentUser.withdrawCount + 1,
    });
    setMessage("已执行一次演示提现：10元。请注意，这只是虚拟演示，不是实际出款。");
  };

  const addAccount = () => {
    if (accounts.length >= 2) {
      setMessage("最多只保留2个演示账户。");
      return;
    }
    const nextId = Math.max(...accounts.map((a) => a.id)) + 1;
    setAccounts((prev) => [
      ...prev,
      {
        id: nextId,
        username: `demo${nextId}`,
        password: "123456",
        balance: 100,
        withdrawCount: 0,
        canWithdraw: true,
        isFrozen: false,
        qrImage:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      },
    ]);
    setMessage("已添加一个新的演示账户。你可以在后台继续修改它的数据。");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-900 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6" />
            <div>
              <div className="text-lg font-bold">反诈演示专用页面</div>
              <div className="mt-1 text-sm">
                本站仅用于向家人演示“登录送余额、先充值再提现、后台可改余额、限制提现次数、扫码付款”等常见骗局界面。
                所有金额都是虚拟演示数据，不可用于真实收款、真实支付或真实提现。
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-4 rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              <h2 className="text-xl font-semibold">登录页</h2>
            </div>
            <div>
              <label className="text-sm font-medium">账号</label>
              <input
                className="mt-1 w-full rounded-2xl border px-3 py-2"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">密码</label>
              <input
                type="password"
                className="mt-1 w-full rounded-2xl border px-3 py-2"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full rounded-2xl bg-slate-900 py-2.5 font-medium text-white"
            >
              登录演示账户
            </button>

            <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
              当前可用演示账号：
              <div className="mt-2 space-y-1">
                {accounts.map((a) => (
                  <div key={a.id}>
                    账号：<span className="font-semibold">{a.username}</span> / 密码：
                    <span className="font-semibold">{a.password}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <h2 className="text-xl font-semibold">用户主页</h2>
            </div>

            {currentUser ? (
              <>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">演示余额</div>
                    <div className="mt-1 text-3xl font-bold">¥{currentUser.balance.toFixed(2)}</div>
                  </div>
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">提现次数</div>
                    <div className="mt-1 text-3xl font-bold">{currentUser.withdrawCount} / 3</div>
                  </div>
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">提现权</div>
                    <div className="mt-1 text-2xl font-bold">{currentUser.canWithdraw ? "允许" : "禁止"}</div>
                  </div>
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">账户状态</div>
                    <div className="mt-1 flex items-center gap-2 text-2xl font-bold">
                      {currentUser.isFrozen ? <Lock className="h-5 w-5" /> : null}
                      {currentUser.isFrozen ? "已冻结" : "正常"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={() => setShowRechargeModal(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl border py-3 font-medium"
                  >
                    <CreditCard className="h-4 w-4" /> 充值
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 font-medium text-white"
                  >
                    <Banknote className="h-4 w-4" /> 提现
                  </button>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <div className="font-semibold">当前演示规则</div>
                  <div className="mt-2 space-y-1">
                    <div>1. 登录后初始显示 100 元演示余额。</div>
                    <div>2. 点击充值后会弹出输入框，确认后显示你预设的收款图片。</div>
                    <div>3. 余额达到 200 元后，提现每次只减少 10 元。</div>
                    <div>4. 超过 3 次后自动冻结。</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border bg-slate-50 p-8 text-center text-slate-600">
                请先登录一个演示账户。
              </div>
            )}
          </section>
        </div>

        <section className="space-y-4 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">后台管理（仅演示）</h2>
          </div>

          {!adminUnlocked ? (
            <div className="grid max-w-xl gap-3 md:grid-cols-[1fr_auto]">
              <input
                type="password"
                className="rounded-2xl border px-3 py-2"
                placeholder="输入后台密码"
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
              />
              <button
                onClick={() => {
                  if (adminInput === adminPassword) {
                    setAdminUnlocked(true);
                    setMessage("后台已解锁。你现在可以修改演示账户数据。");
                  } else {
                    setMessage("后台密码错误。");
                  }
                }}
                className="rounded-2xl bg-slate-900 px-5 py-2 text-white"
              >
                解锁后台
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={addAccount}
                  className="flex items-center gap-2 rounded-2xl border px-4 py-2 font-medium"
                >
                  <UserPlus className="h-4 w-4" /> 添加演示账户（最多2个）
                </button>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                {accounts.map((a) => (
                  <div key={a.id} className="space-y-4 rounded-3xl border bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-bold">{a.username}</div>
                        <div className="text-sm text-slate-500">ID: {a.id}</div>
                      </div>
                      <button
                        onClick={() => setCurrentUserId(a.id)}
                        className="rounded-2xl border bg-white px-4 py-2 text-sm"
                      >
                        切换到该账户
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">账号</label>
                        <input
                          className="mt-1 w-full rounded-2xl border px-3 py-2"
                          value={a.username}
                          onChange={(e) => updateAccount(a.id, { username: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">密码</label>
                        <input
                          className="mt-1 w-full rounded-2xl border px-3 py-2"
                          value={a.password}
                          onChange={(e) => updateAccount(a.id, { password: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">余额</label>
                        <input
                          type="number"
                          className="mt-1 w-full rounded-2xl border px-3 py-2"
                          value={a.balance}
                          onChange={(e) => updateAccount(a.id, { balance: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">提现次数</label>
                        <input
                          type="number"
                          className="mt-1 w-full rounded-2xl border px-3 py-2"
                          value={a.withdrawCount}
                          onChange={(e) =>
                            updateAccount(a.id, { withdrawCount: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm md:grid-cols-3">
                      <button
                        onClick={() => updateAccount(a.id, { canWithdraw: !a.canWithdraw })}
                        className="rounded-2xl border bg-white px-4 py-2"
                      >
                        提现权：{a.canWithdraw ? "允许" : "禁止"}
                      </button>
                      <button
                        onClick={() => updateAccount(a.id, { isFrozen: !a.isFrozen })}
                        className="rounded-2xl border bg-white px-4 py-2"
                      >
                        账户：{a.isFrozen ? "已冻结" : "正常"}
                      </button>
                      <button
                        onClick={() =>
                          updateAccount(a.id, {
                            balance: 100,
                            withdrawCount: 0,
                            canWithdraw: true,
                            isFrozen: false,
                          })
                        }
                        className="rounded-2xl border bg-white px-4 py-2"
                      >
                        重置演示数据
                      </button>
                    </div>

                    <div>
                      <label className="text-sm font-medium">充值后显示的图片地址</label>
                      <input
                        className="mt-1 w-full rounded-2xl border px-3 py-2"
                        value={a.qrImage}
                        onChange={(e) => updateAccount(a.id, { qrImage: e.target.value })}
                        placeholder="可填图片链接，用于演示扫码付款页面"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="max-w-xl space-y-2">
                <label className="text-sm font-medium">后台密码（可修改）</label>
                <input
                  className="w-full rounded-2xl border px-3 py-2"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
            </>
          )}
        </section>

        <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
          <div className="font-semibold">页面提示</div>
          <div className="mt-2 text-sm text-slate-200">{message}</div>
        </section>
      </div>

      {showRechargeModal && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="text-xl font-semibold">输入演示充值金额</div>
            <input
              type="number"
              className="w-full rounded-2xl border px-3 py-2"
              placeholder="例如 100"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
            />
            <div className="text-sm text-slate-600">
              点击确认后会展示你在后台设置的图片，用于演示“扫码充值/转账收款”的常见界面。
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowRechargeModal(false)}
                className="rounded-2xl border py-2.5"
              >
                取消
              </button>
              <button
                onClick={handleRechargeConfirm}
                className="rounded-2xl bg-slate-900 py-2.5 text-white"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="text-xl font-semibold">演示收款图片</div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              仅用于反诈演示：现实中凡是让你扫码转账、先充值才能提现的平台，都应高度警惕。
            </div>
            <img
              src={currentUser.qrImage}
              alt="演示收款图片"
              className="h-80 w-full rounded-2xl border object-cover"
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  const amount = Number(rechargeAmount || 0);
                  if (amount > 0) {
                    updateAccount(currentUser.id, { balance: currentUser.balance + amount });
                    setMessage(`已增加演示余额 ${amount} 元。注意：这是你手动模拟的效果，并非真实到账。`);
                  }
                  setRechargeAmount("");
                }}
                className="rounded-2xl border py-2.5"
              >
                关闭并模拟到账
              </button>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setRechargeAmount("");
                }}
                className="rounded-2xl bg-slate-900 py-2.5 text-white"
              >
                仅关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
