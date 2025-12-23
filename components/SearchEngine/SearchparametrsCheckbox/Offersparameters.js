import { FaCheckSquare } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Offersparameters({ name, title }) {
  const router = useRouter();

  let ActualValue;

  searchConditions.map((param) => {
    if (param.name === name) ActualValue = param.value;
  });

  const handleFunction = (e) => {
    let name = e.target.getAttribute("name");
    const page = "page=" + router.query.page;
    console.log(router.asPath.toString());
    // console.log(name)
    // console.log(page)

    if (router.asPath.toString().includes(name)) {
      const params = new URLSearchParams(router.query);
      params.delete(name);
      params.set("page", 1);
      // params.append(page, 1);
      const queryString = params.toString();
      console.log(queryString);
      const path = `/[country]${queryString ? `?${queryString}` : ""}`;
      router.push(path, "", { scroll: false });
    } else {
      const params = new URLSearchParams(router.query);
      params.append(name, true);
      params.set("page", 1);
      const queryString = params.toString();
      console.log(queryString);
      const path = `/[country]${queryString ? `?${queryString}` : ""}`;
      router.push(path, "", { scroll: false });
    }
  };

  return (
    <>
      <div className="flex items-center w-[175px] lg:w-[180px] md:w-11/12">
        <div
          // onClick={handleFunction}
          name={name}
          className={
            router.asPath.includes(name)
              ? "rounded-sm border-gray-700 my-2 mr-2 w-5 h-5 p-0 accent-red-600 cursor-pointer"
              : "rounded-sm border-gray-700 my-2 mr-2 w-5 h-5 p-0 accent-red-600 cursor-pointer border"
          }
        >
          <div
            name={name}
            className={
              router.asPath.includes(name)
                ? "rounded-sm bg-orange-500 text-white w-full h-full"
                : "hidden"
            }
          >
            <FaCheckSquare
              name={name}
              className="w-full h-full rounded-sm flex items-center justify-center"
            />
          </div>
        </div>
        <p className="font-bold block">{title}</p>
      </div>
    </>
  );
}
