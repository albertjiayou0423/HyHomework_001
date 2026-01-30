export function DiffView({ oldContent, newContent }) {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  // Very simplified diff logic for demo
  // In a real app, use a lib like 'diff' or 'react-diff-viewer'
  return (
    <div className="font-mono text-sm border border-[#30363d] rounded-md overflow-hidden bg-[#0d1117]">
      <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] text-xs text-[#7d8590]">
        Showing changes
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {oldLines.map((line, i) => (
              <tr key={`old-${i}`} className="bg-[#ffdcd7]/10">
                <td className="w-10 text-right px-2 select-none text-[#7d8590] border-r border-[#30363d]">{i+1}</td>
                <td className="px-4 text-[#ff816e]">- {line}</td>
              </tr>
            ))}
            {newLines.map((line, i) => (
              <tr key={`new-${i}`} className="bg-[#dafbe1]/10">
                <td className="w-10 text-right px-2 select-none text-[#7d8590] border-r border-[#30363d]">{i+1}</td>
                <td className="px-4 text-[#3fb950]">+ {line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
