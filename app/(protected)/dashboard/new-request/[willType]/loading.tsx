


export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600">جارٍ تحميل النموذج...</p>
    </div>
  );
}