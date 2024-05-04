import {
  NodeCircle,
  NodeCircleBg,
  ProgressBarContainer,
  ProgressBarNode,
} from '@/styles/atoms/ProgressBar.styles';

interface ProgressBarPropsItf {
  $progress: number;
}

const ProgressBar = ({
  $progress,
}: ProgressBarPropsItf): React.ReactElement => {
  const isActive = (index: number) => (index + 1) * 25 <= $progress;
  const isNextNodeActive = (index: number) =>
    index === 4 || Math.round((index + 2) * 25) <= $progress;
  const isPrevNodeActive = (index: number) =>
    index === 0 || Math.round((index - 1) * 25) < $progress;

  return (
    <ProgressBarContainer>
      {[0, 1, 2, 3].map((index) => (
        <ProgressBarNode
          key={index}
          $isActive={isActive(index)}
          $isNextNodeActive={isNextNodeActive(index)}
          $isPrevNodeActive={isPrevNodeActive(index)}
          $isComplete={$progress === 100}
        >
          <NodeCircleBg $isActive={isActive(index)}>
            <NodeCircle $isActive={isActive(index)} />
          </NodeCircleBg>
        </ProgressBarNode>
      ))}
    </ProgressBarContainer>
  );
};

export default ProgressBar;
