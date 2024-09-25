export default function Keyboard({ handleButtonClick }) {
  const letters = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  return (
    <div className="flex items-center justify-center flex-col gap-4 mt-4">
      {letters.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.split("").map((key, keyIndex) => (
            <button
              key={keyIndex}
              className="bg-white font-bold border-0 outline-none border-0 rounded h-12 w-8 md:w-12 text-xl hover:bg-gray-400 text-black"
              onClick={() => handleButtonClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
