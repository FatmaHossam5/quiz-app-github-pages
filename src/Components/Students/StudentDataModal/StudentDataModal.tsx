import Label from '../../../Shared/Label/Label'
import userImg from '../../../assets/user img.png'

export interface StudentDataModalProp{
  studentInfo:{
    email:string,
    last_name:string,
    first_name:string,
    group:{
      name:string
    },
    _id?:string;
    avg_score?:string;
  }
}

export default function StudentDataModal({studentInfo}:StudentDataModalProp) {
  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Student Profile Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <img 
            src={userImg} 
            alt={`${studentInfo.first_name} ${studentInfo.last_name}`}
            className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-lg mx-auto"
          />
          {studentInfo.avg_score && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white">
              {studentInfo.avg_score}%
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-1">
          {studentInfo.first_name} {studentInfo.last_name}
        </h2>
        <p className="text-gray-600 text-sm">
          Student ID: {studentInfo._id?.slice(-8) || 'N/A'}
        </p>
      </div>

      {/* Student Information Section */}
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fa-solid fa-user mr-2 text-blue-600"></i>
            Personal Information
          </h3>
          <div className="space-y-3">
            <Label
              word="First Name"
              class_Name="w-full"
              value={studentInfo.first_name}
            />
            <Label
              word="Last Name"
              class_Name="w-full"
              value={studentInfo.last_name}
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fa-solid fa-envelope mr-2 text-green-600"></i>
            Contact Information
          </h3>
          <div className="space-y-3">
            <Label
              word="Email Address"
              class_Name="w-full"
              value={studentInfo.email}
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fa-solid fa-users mr-2 text-purple-600"></i>
            Academic Information
          </h3>
          <div className="space-y-3">
            <Label
              word="Group Assignment"
              class_Name="w-full"
              value={studentInfo.group?.name || "No group assigned"}
            />
            {studentInfo.avg_score && (
              <div className="w-full border rounded-lg font-semibold grid grid-cols-2 my-3">
                <div className="word bg-authImage py-3 ps-3 flex items-center">
                  <i className="fa-solid fa-chart-line mr-2"></i>
                  Average Score
                </div>
                <div className="value p-3 ms-1 flex items-center">
                  <span className="text-lg font-bold text-green-600">
                    {studentInfo.avg_score}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <i className="fa-solid fa-edit mr-2"></i>
            Edit Student
          </button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <i className="fa-solid fa-download mr-2"></i>
            Export Data
          </button>
        </div>
      </div>
    </div>
  )
}
