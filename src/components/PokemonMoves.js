export default function PokemonMoves({ moves }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {moves.slice(0, 12).map(move => (
        <div key={move.move.name} className="bg-[#306230] border-2 border-[#0f380f] p-2">
          <span className="text-[#98cb98] text-xs uppercase">{move.move.name}</span>
        </div>
      ))}
    </div>
  );
} 