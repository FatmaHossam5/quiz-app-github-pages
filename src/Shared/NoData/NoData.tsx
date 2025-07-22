import noData from '../../assets/Transfer files-amico.png'
export default function NoData() {
  return (
    <>
    <div className='w-[50%] m-auto text-center'>
    <img src={noData} alt="noData"/>
<p className='font-semibold text-zinc-700 text-1xl w-full'>Not Found data</p>
    </div>
    </>
  )
}
