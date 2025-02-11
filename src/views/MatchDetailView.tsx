import { useContext } from 'react';
import { Context } from 'App';
import { formatDateTime, formatDuration, getStatusColor, getStatusText } from 'utils/format';

const MatchDetailView = () => {
  const context = useContext(Context);
  const matchData = context?.teammateArr;

  if (!matchData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-400">
        未找到对局数据
      </div>
    );
  }

  const getMapName = (mapId: string) => {
    return context?.mapName?.[mapId] || '未知地图';
  };

  return (
    <div className="h-full bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 对局基本信息 */}
        <div className="bg-gray-800/80 backdrop-blur p-4 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">对局信息</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400">对局时间</p>
              <p className="font-medium">{formatDateTime(matchData[0].dtEventTime)}</p>
            </div>
            <div>
              <p className="text-gray-400">地图</p>
              <p className="font-medium">{getMapName(matchData[0].MapId)}</p>
            </div>
          </div>
        </div>

        {/* 队伍成员数据 */}
        <div className="bg-gray-800/80 backdrop-blur p-4 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">队伍成员</h2>
          <div className="grid gap-4">
            {matchData.map((teammate, index) => (
              <div
                key={teammate.TeamId + index}
                className="bg-gray-700/50 p-4 rounded-lg grid grid-cols-3 md:grid-cols-4 gap-4"
              >
                <div className="w-14 h-14 md:w-24 md:h-24 bg-gray-700 overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={context?.agentImg?.[teammate.ArmedForceId]}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                </div>
                <div>
                  <p className={`font-medium ${getStatusColor(teammate.EscapeFailReason)}`}>
                    {getStatusText(teammate.EscapeFailReason)}
                  </p>
                  <p className="text-gray-100 font-semibold tracking-wide">
                    {context?.agentName[teammate.ArmedForceId]}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">击杀玩家</p>
                  <p className="font-medium text-yellow-500">{teammate.KillCount}</p>
                </div>

                <div>
                  <p className="text-gray-400">游戏时长</p>
                  <p className="font-medium text-blue-500">{formatDuration(teammate.DurationS)}</p>
                </div>
                <div>
                  <p className="text-gray-400">救助/复活</p>
                  <p className="font-medium text-purple-500">{teammate.Rescue}</p>
                </div>
                <div>
                  <p className="text-gray-400">收益</p>
                  <p className="font-medium text-yellow-500">{teammate.FinalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { MatchDetailView };
