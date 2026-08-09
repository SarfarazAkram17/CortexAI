import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftIcon,
  PanelRightIcon,
  PenSquare,
  Plus,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversations,
  setSelectConversation,
} from "../redux/conversationSlice";
import { logOut } from "../features/logOut";
import { setUserdata } from "../redux/userSlice";
import { setArtifacts, setMessages } from "../redux/messageSlice";
import BillingDrawer from "./BillingDrawer";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };

    getConv();
  }, [dispatch, userData?._id]);

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-14 h-screen bg-[#0d0f14] border-r border-white/6 py-4 gap-1 shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
        >
          <PanelRightIcon />
        </button>

        <button
          onClick={() => {
            dispatch(setSelectConversation(null));
            dispatch(setMessages([]));
            dispatch(setArtifacts([]));
          }}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
        >
          <Plus size={17} />
        </button>

        <div className="flex-1 overflow-y-auto px-2.5 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden pt-5">
          {conversations.map((conv, i) => {
            const isActive = selectedConversation?._id == conv?._id;

            return (
              <div
                key={i}
                onClick={() => dispatch(setSelectConversation(conv))}
                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 ${isActive ? "bg-indigo-500/10 border-indigo-500/18" : "bg-transparent border-transparent"}`}
              >
                <div
                  className={`flex items-center justify-center shrink-0 w-5 h-5 rounded-lg transition-colors duration-150 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/5 text-slate-500"}`}
                >
                  <MessageSquare size={13} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative shrink-0">
          {userData?.avatar && !imageError ? (
            <img
              src={userData?.avatar}
              alt="Profile Image"
              className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-white/6">
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/6 text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={14} />
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-67.5 h-screen shrink-0 bg-[#0d0f14] border-r border-white/6 transition-transform duration-250 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2.5 p-4 border-b border-white/6">
            <div
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              <PanelLeftIcon />
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              <X />
            </button>

            <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
              CortexAI
            </span>
            <span className="capitalize flex justify-center items-center text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
              {userData?.plan}
            </span>
            <button
              onClick={() => {
                dispatch(setSelectConversation(null));
                dispatch(setMessages([]));
                dispatch(setArtifacts([]));
              }}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              <PenSquare />
            </button>
          </div>

          <div className="px-4 pt-4 pb-1">
            <button
              onClick={() => {
                dispatch(setSelectConversation(null));
                dispatch(setMessages([]));
                dispatch(setArtifacts([]));
              }}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-2.5 border-none cursor-pointer hover:opacity-90 transition-opacity duration-150"
            >
              <Plus size={15} /> New Chat
            </button>
          </div>

          {conversations.length > 0 ? (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              Recents
            </div>
          ) : (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              No Recent Conversations
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-2.5 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {conversations.map((conv, i) => {
              const isActive = selectedConversation?._id == conv?._id;

              return (
                <div
                  key={i}
                  onClick={() => dispatch(setSelectConversation(conv))}
                  className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 ${isActive ? "bg-indigo-500/10 border-indigo-500/18" : "bg-transparent border-transparent"}`}
                >
                  <div
                    className={`flex items-center justify-center shrink-0 w-7 h-7 rounded-lg transition-colors duration-150 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/5 text-slate-500"}`}
                  >
                    <MessageSquare size={13} />
                  </div>
                  <span
                    className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-300"}`}
                  >
                    {conv?.title || "New Chat"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mx-2.5 h-px bg-white/6" />

          <div className="p-3.5">
            {userData && (
              <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors duration-150">
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      src={userData?.avatar}
                      alt="Profile Image"
                      className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-white/6">
                      <User size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-px capitalize">
                    {userData?.plan || "Free"}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setShowBilling(true)}
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/8 hover:text-slate-400 transition-all duration-150"
                  >
                    <Coins size={16} />
                  </button>
                  <button
                    onClick={() => {
                      logOut();
                      dispatch(setUserdata(null));
                    }}
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/8 hover:text-slate-400 transition-all duration-150"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
    </>
  );
};

export default SideBar;
