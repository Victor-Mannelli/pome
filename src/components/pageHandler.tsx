import { useRouter } from 'next/router';
import Button from './models/button';

export default function PageHandler({ 
  currentPage, 
  hasNextPage, 
  route 
} : { 
  currentPage: number, 
  hasNextPage: boolean, 
  route: string
}) {  
  const router = useRouter();
  return (
    <div className="flex justify-center items-center w-full">
      {currentPage > 1 
        ? <Button
          className="bg-third"
          onClick={() => router.push({
            pathname: `/${route}`, 
            query: { page: `${currentPage - 1}`}
          })}
          text="Back" 
        /> 
        : <Button 
          className="bg-third"
          onClick={() => console.log()} 
          text="Back" 
        /> 
      }
      <h3 className="font-bold px-5"> { currentPage } </h3>
      {hasNextPage 
        ? <Button 
          text="Next" 
          className="bg-third"
          onClick={() => router.push({
            pathname: `/${route}`, 
            query: { page: `${currentPage + 1}`}
          })}
        /> 
        : null 
      }
    </div>
  );
}
