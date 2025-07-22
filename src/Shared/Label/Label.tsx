interface LabelInterface{
    word:string;
    value:string;
    class_Name?:string;
    textClassName?:string
}

export default function Label({word,value,class_Name,textClassName}:LabelInterface) {
  return (
    <div className={`w-full border border-gray-200 rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow duration-200 ${class_Name} my-2`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
        <div className="word bg-gray-100 py-3 px-4 text-gray-700 font-semibold text-sm sm:text-base border-r border-gray-200 flex items-center">
          <span className="truncate">{word}</span>
        </div>
        <div className={`value py-3 px-4 text-gray-900 text-sm sm:text-base col-span-1 sm:col-span-2 lg:col-span-3 flex items-center ${textClassName}`}>
          <span className="truncate">{value || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}
