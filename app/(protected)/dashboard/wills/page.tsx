"use client";

import React, { useState, useEffect } from "react";
import {
  RxFileText,
  RxCheck,
  RxExclamationTriangle,
  RxPlus,
  RxDownload,
  RxDotsHorizontal,
  RxCross2,
  RxTrash,
} from "react-icons/rx";

type WillStatus = "مكتملة" | "قيد المراجعة" | "بحاجة تعديل" | "مسودة";
type WillType = "وصية عامة" | "وصية مالية" | "وصية بالأعمال" | "وصية بالأحسان";

interface Will {
  id: string;
  type: WillType;
  status: WillStatus;
  dateStr: string;
  dateObj: Date;
  updatedAt: string;
  progress: number;
  stepName: string;
  reviewerNotes?: string;
  documents?: { name: string; url: string }[];
}

const mockWills: Will[] = [
  {
    id: "# WAS-2026-002",
    type: "وصية مالية",
    status: "قيد المراجعة",
    dateStr: "20 مارس 2026",
    dateObj: new Date("2026-03-20"),
    updatedAt: "21 مارس 2026",
    progress: 75,
    stepName: "الخطوة 3 من 4: مراجعة الخبير",
    documents: [{ name: "مسودة_الحسابات.pdf", url: "#" }],
  },
  {
    id: "# WAS-2026-005",
    type: "وصية عامة",
    status: "قيد المراجعة",
    dateStr: "28 مارس 2026",
    dateObj: new Date("2026-03-28"),
    updatedAt: "29 مارس 2026",
    progress: 75,
    stepName: "الخطوة 3 من 4: المراجعة والتدقيق القانوني",
  },
];

const priorityMap: Record<WillStatus, number> = {
  "بحاجة تعديل": 1,
  "قيد المراجعة": 2,
  مسودة: 3,
  مكتملة: 4,
};

export default function MyWillsPage() {
  const [loading, setLoading] = useState(true);
  const [wills, setWills] = useState<Will[]>([]);
  const [sort] = useState<"الأولوية" | "الأحدث" | "الأقدم" | "النوع">("الأحدث");
  const [selectedWill, setSelectedWill] = useState<Will | null>(null);
  const [deleteWillId, setDeleteWillId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWills(mockWills.filter((w) => w.status === "قيد المراجعة"));
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedWill) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedWill]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const sortedAndFilteredWills = wills.sort((a, b) => {
    if (sort === "الأولوية") {
      if (priorityMap[a.status] !== priorityMap[b.status]) {
        return priorityMap[a.status] - priorityMap[b.status];
      }
      return b.dateObj.getTime() - a.dateObj.getTime();
    } else if (sort === "الأحدث") {
      return b.dateObj.getTime() - a.dateObj.getTime();
    } else if (sort === "الأقدم") {
      return a.dateObj.getTime() - b.dateObj.getTime();
    } else if (sort === "النوع") {
      return a.type.localeCompare(b.type, "ar");
    }
    return 0;
  });

  const getTopBarColor = (type: WillType) => {
    switch (type) {
      case "وصية عامة":
        return "bg-primary";
      case "وصية مالية":
        return "bg-accent";
      case "وصية بالأعمال":
        return "bg-primary/60";
      case "وصية بالأحسان":
        return "bg-accent/60";
    }
  };

  const getIconColors = (type: WillType) => {
    switch (type) {
      case "وصية عامة":
        return "bg-primary/10 text-primary";
      case "وصية مالية":
        return "bg-accent/10 text-accent-foreground";
      case "وصية بالأعمال":
        return "bg-primary/10 text-primary";
      case "وصية بالأحسان":
        return "bg-accent/10 text-accent-foreground";
    }
  };

  const getBadgeColors = (status: WillStatus) => {
    switch (status) {
      case "مكتملة":
        return { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" };
      case "قيد المراجعة":
        return {
          bg: "bg-accent/10",
          text: "text-accent-foreground",
          dot: "bg-accent",
        };
      case "بحاجة تعديل":
        return { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" };
      case "مسودة":
        return {
          bg: "bg-border",
          text: "text-muted-foreground",
          dot: "bg-muted-foreground",
        };
    }
  };

  const getPrimaryButtonText = (status: WillStatus) => {
    switch (status) {
      case "مسودة":
        return "متابعة الإدخال →";
      case "قيد المراجعة":
        return "عرض التفاصيل →";
      case "بحاجة تعديل":
        return "تصحيح الآن →";
      case "مكتملة":
        return "عرض الوصية →";
    }
  };

  const getPrimaryButtonClasses = (status: WillStatus) => {
    switch (status) {
      case "بحاجة تعديل":
        return "bg-red-600 text-white hover:bg-red-700";
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
  };

  const handleDelete = () => {
    if (deleteWillId) {
      setWills(wills.filter((w) => w.id !== deleteWillId));
      setDeleteWillId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* 1. PAGE HEADER */}
      <header className="w-full bg-surface border-b border-border px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">وصاياي</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            إدارة وصاياك القانونية ومتابعة حالتها
          </p>
        </div>
        <button className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 font-medium text-sm hover:bg-primary/90 transition active:scale-95 shadow-sm flex items-center justify-center gap-2 max-md:w-full">
          <span>
            <RxPlus className="text-lg" />
          </span>
          <span className="md:inline">إنشاء وصية جديدة</span>
        </button>
      </header>

      {/* 4. WILL CARDS GRID / STATE */}
      <div className="py-6 bg-background max-w-7xl">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface rounded-3xl border border-border overflow-hidden animate-pulse flex flex-col"
              >
                <div className="h-1 w-full bg-border"></div>
                <div className="p-5 pb-3 flex justify-between">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-border shrink-0"></div>
                    <div>
                      <div className="w-24 h-4 bg-border rounded mt-2"></div>
                      <div className="w-16 h-3 bg-border rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-border rounded-full"></div>
                </div>
                <div className="border-t border-border mx-5 mt-2"></div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <div className="w-20 h-3 bg-border rounded"></div>
                  <div className="w-24 h-3 bg-border rounded"></div>
                </div>
                <div className="px-5 pb-3">
                  <div className="w-full h-1.5 bg-border rounded-full mt-2"></div>
                </div>
                <div className="px-5 pb-5 pt-2 flex gap-2">
                  <div className="w-9 h-9 rounded-xl bg-border shrink-0"></div>
                  <div className="w-full h-9 bg-border rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedAndFilteredWills.length === 0 ? (
          <div className="py-24 flex flex-col items-center">
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary text-5xl mb-6">
              <RxFileText />
            </div>
            <h3 className="text-xl font-bold text-foreground text-center">
              لا توجد وصايا بانتظار التقييم
            </h3>
            <p className="text-sm text-muted-foreground mt-2 text-center max-w-sm leading-7">
              أنت حاليا لا تملك أي وصايا قيد المراجعة والتقييم من قبل الإدارة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedAndFilteredWills.map((will) => {
              const b = getBadgeColors(will.status);

              return (
                <div
                  key={will.id}
                  className="bg-surface rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  {/* Top Bar */}
                  <div
                    className={`h-1 w-full ${getTopBarColor(will.type)}`}
                  ></div>

                  {/* Header */}
                  <div
                    className="p-5 pb-3 flex justify-between items-start cursor-pointer"
                    onClick={() => setSelectedWill(will)}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${getIconColors(will.type)}`}
                      >
                        <RxFileText className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground mt-1">
                          {will.type}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {will.id}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 ${b.bg} ${b.text}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${b.dot}`}
                      ></div>
                      {will.status}
                    </div>
                  </div>

                  <div className="border-t border-border mx-5"></div>

                  {/* Meta */}
                  <div
                    className="px-5 py-3 flex justify-between items-center cursor-pointer"
                    onClick={() => setSelectedWill(will)}
                  >
                    <span className="text-xs text-muted-foreground">
                      تاريخ الإنشاء
                    </span>
                    <span className="text-xs text-foreground font-medium">
                      {will.dateStr}
                    </span>
                  </div>

                  {/* Progress (if not complete or draft) */}
                  {will.status !== "مكتملة" && will.status !== "مسودة" && (
                    <div
                      className="px-5 pb-3 cursor-pointer"
                      onClick={() => setSelectedWill(will)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">
                          {will.stepName}
                        </span>
                        <span className="text-xs font-bold text-primary">
                          {will.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full w-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${will.progress}%` }}
                        ></div>
                      </div>

                      {will.status === "بحاجة تعديل" && (
                        <div className="bg-red-500/10 rounded-xl px-3 py-2 mt-2 flex items-center gap-2">
                          <RxExclamationTriangle className="text-red-500 text-sm shrink-0" />
                          <span className="text-red-600 text-xs font-medium">
                            يستلزم مراجعة المعلومات وإعادة الإرسال
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Spacer to push actions down if needed */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedWill(will)}
                  ></div>

                  {/* Actions */}
                  <div className="px-5 pb-5 pt-2 flex gap-2 relative">
                    <div className="relative">
                      <button
                        title="خيارات الوصية"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(
                            menuOpenId === will.id ? null : will.id,
                          );
                        }}
                        className="bg-background border border-border hover:bg-border/50 rounded-xl p-2 w-10 h-10 flex items-center justify-center text-muted-foreground transition-colors"
                      >
                        <RxDotsHorizontal className="text-lg" />
                      </button>

                      {/* Menu Dropdown */}
                      {menuOpenId === will.id && (
                        <div
                          className="absolute bottom-full right-0 mb-2 w-40 bg-surface border border-border rounded-2xl shadow-md py-1 z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setSelectedWill(will);
                              setMenuOpenId(null);
                            }}
                            className="w-full text-right px-4 py-2 text-sm text-foreground hover:bg-background transition-colors"
                          >
                            عرض التفاصيل
                          </button>
                          <button className="w-full text-right px-4 py-2 text-sm text-foreground hover:bg-background transition-colors">
                            تعديل
                          </button>
                          <button className="w-full text-right px-4 py-2 text-sm text-foreground hover:bg-background transition-colors">
                            نسخ
                          </button>
                          <div className="border-t border-border my-1"></div>
                          <button
                            onClick={() => {
                              setDeleteWillId(will.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full text-right px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      )}
                    </div>

                    {will.status === "مكتملة" && (
                      <button
                        title="تحميل PDF"
                        className="bg-background border border-border hover:bg-border/50 rounded-xl p-2 w-10 h-10 flex items-center justify-center text-primary transition-colors"
                      >
                        <RxDownload className="text-lg" />
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedWill(will)}
                      className={`flex-1 rounded-xl py-2 text-sm font-medium text-center transition active:scale-95 ${getPrimaryButtonClasses(will.status)}`}
                    >
                      {getPrimaryButtonText(will.status)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. DRAWER OVERLAY & PANEL */}
      {selectedWill && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-foreground/40 transition-opacity"
            onClick={() => setSelectedWill(null)}
          ></div>

          <div className="relative w-full md:w-120 bg-background h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            {/* Drawer Header */}
            <div
              className={`p-6 flex items-start justify-between ${getTopBarColor(selectedWill.type)}`}
            >
              <div>
                <h2 className="text-primary-foreground text-lg font-bold">
                  {selectedWill.type}
                </h2>
                <p className="text-primary-foreground/60 text-xs mt-0.5">
                  {selectedWill.id}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 bg-surface/20 text-primary-foreground`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full bg-primary-foreground`}
                  ></div>
                  {selectedWill.status}
                </div>
                <button
                  title="إغلاق النافذة"
                  onClick={() => setSelectedWill(null)}
                  className="text-primary-foreground/70 hover:text-primary-foreground p-1 rounded-full hover:bg-surface/10 transition-colors"
                >
                  <RxCross2 className="text-xl" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Block 1: Details */}
              <div>
                <h4 className="text-xs text-muted-foreground font-medium mb-3">
                  تفاصيل الوصية
                </h4>
                <div className="bg-surface rounded-2xl p-4 border border-border top-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">النوع</span>
                    <span className="text-sm text-foreground font-medium">
                      {selectedWill.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      الحالة
                    </span>
                    <span className="text-sm text-foreground font-medium">
                      {selectedWill.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      تاريخ الإنشاء
                    </span>
                    <span className="text-sm text-foreground font-medium">
                      {selectedWill.dateStr}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      آخر تعديل
                    </span>
                    <span className="text-sm text-foreground font-medium">
                      {selectedWill.updatedAt}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      رقم الملف
                    </span>
                    <span className="text-sm text-foreground font-medium">
                      {selectedWill.id.replace("# ", "")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Block 2: Notes (If Needs Fix) */}
              {selectedWill.status === "بحاجة تعديل" &&
                selectedWill.reviewerNotes && (
                  <div>
                    <h4 className="text-xs text-red-500 font-medium mb-3">
                      ملاحظات المراجع
                    </h4>
                    <div className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20 text-sm text-red-700 leading-7 font-medium">
                      {selectedWill.reviewerNotes}
                    </div>
                  </div>
                )}

              {/* Block 3: Stepper */}
              <div>
                <h4 className="text-xs text-muted-foreground font-medium mb-3">
                  مسار الوصية
                </h4>
                <div className="bg-surface rounded-2xl p-5 border border-border">
                  <div className="flex flex-col gap-0 relative">
                    <div className="absolute right-4 top-2 bottom-6 w-0.5 bg-border z-0"></div>

                    <div className="flex gap-4 relative z-10 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 border-2 border-surface">
                        <RxCheck />
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-medium text-foreground">
                          البيانات الأساسية
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {selectedWill.dateStr}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 relative z-10 mb-4">
                      {selectedWill.progress >= 50 ? (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 border-2 border-surface">
                          <RxCheck />
                        </div>
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full ${selectedWill.status === "مسودة" ? "bg-primary ring-4 ring-primary/20 animate-pulse" : "bg-border"} shrink-0 border-2 border-surface`}
                        ></div>
                      )}
                      <div className="pt-1">
                        <p
                          className={`text-sm ${selectedWill.progress >= 50 ? "font-medium text-foreground" : selectedWill.status === "مسودة" ? "font-bold text-primary" : "text-muted-foreground"}`}
                        >
                          تفاصيل الأصول والمستفيدين
                        </p>
                        {selectedWill.progress >= 50 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {selectedWill.updatedAt}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 relative z-10 mb-4">
                      {selectedWill.progress >= 75 ? (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 border-2 border-surface">
                          <RxCheck />
                        </div>
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full ${selectedWill.progress >= 50 && selectedWill.status !== "مسودة" && selectedWill.status !== "مكتملة" ? "bg-primary ring-4 ring-primary/20 animate-pulse" : "bg-border"} shrink-0 border-2 border-surface`}
                        ></div>
                      )}
                      <div className="pt-1">
                        <p
                          className={`text-sm ${selectedWill.progress >= 75 ? "font-medium text-foreground" : selectedWill.progress >= 50 && selectedWill.status !== "مسودة" && selectedWill.status !== "مكتملة" ? "font-bold text-primary" : "text-muted-foreground"}`}
                        >
                          المراجعة والتدقيق القانوني
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                      {selectedWill.status === "مكتملة" ? (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 border-2 border-surface">
                          <RxCheck />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-border shrink-0 border-2 border-surface"></div>
                      )}
                      <div className="pt-1">
                        <p
                          className={`text-sm ${selectedWill.status === "مكتملة" ? "font-medium text-foreground" : "text-muted-foreground"}`}
                        >
                          اعتماد الوصية النهائي
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 4: Documents */}
              {selectedWill.documents && selectedWill.documents.length > 0 && (
                <div>
                  <h4 className="text-xs text-muted-foreground font-medium mb-3">
                    المستندات
                  </h4>
                  <div className="space-y-2">
                    {selectedWill.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="bg-surface border border-border rounded-xl p-3 flex justify-between items-center group hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <RxFileText />
                          </div>
                          <span className="text-sm text-foreground font-medium line-clamp-1">
                            {doc.name}
                          </span>
                        </div>
                        <a
                          href={doc.url}
                          title="تحميل المستند"
                          className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <RxDownload className="text-lg" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-5 bg-surface border-t border-border flex items-center gap-3">
              <button
                className={`flex-1 rounded-xl py-3 font-bold text-sm shadow-sm transition active:scale-95 ${getPrimaryButtonClasses(selectedWill.status)}`}
              >
                {getPrimaryButtonText(selectedWill.status)}
              </button>
              <button
                onClick={() => setSelectedWill(null)}
                className="px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground border border-transparent transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteWillId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm transition-opacity"
            onClick={() => setDeleteWillId(null)}
          ></div>
          <div className="relative bg-surface rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center text-2xl mx-auto mb-4">
              <RxTrash />
            </div>
            <h3 className="text-lg font-bold text-foreground text-center mb-2">
              تأكيد حذف الوصية
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف مسودة هذه الوصية نهائياً؟ لا يمكن
              التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 font-bold text-sm hover:bg-red-700 transition shadow-sm"
              >
                تأكيد الحذف
              </button>
              <button
                onClick={() => setDeleteWillId(null)}
                className="flex-1 bg-background border border-border text-foreground rounded-xl py-2.5 font-bold text-sm hover:bg-border/50 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
