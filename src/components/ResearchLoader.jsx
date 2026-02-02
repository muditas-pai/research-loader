import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { CheckCircle, MagnifyingGlass } from '@phosphor-icons/react';
import { steps } from '../data/steps';
import './ResearchLoader.css';

const STEP_DURATION = 5000; // 5 seconds per step
const STREAMING_START = 3000; // Start streaming after 3 seconds

function ResearchLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepPhase, setStepPhase] = useState('inProgress'); // 'inProgress' | 'streaming' | 'completed'
  const [visibleUnits, setVisibleUnits] = useState(0); // words for text, items for arrays
  const [completedSteps, setCompletedSteps] = useState([]);
  const [translateY, setTranslateY] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const currentStepRef = useRef(null);
  const timelineRef = useRef(null);
  const translateYRef = useRef(0);

  const getCurrentStep = useCallback(() => {
    if (currentStep >= steps.length) return null;
    return steps[currentStep];
  }, [currentStep]);

  const getStreamingUnits = useCallback(() => {
    const step = getCurrentStep();
    if (!step) return [];
    if (Array.isArray(step.summary)) {
      return step.summary;
    }
    return step.summary.split(' ');
  }, [getCurrentStep]);

  // Keep ref in sync with state
  useEffect(() => {
    translateYRef.current = translateY;
  }, [translateY]);

  // Center the current step title in viewport (only on new step)
  useLayoutEffect(() => {
    const centerStep = () => {
      if (!currentStepRef.current) return;

      const stepRect = currentStepRef.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const stepTitleCenter = stepRect.top + 12;
      const offset = viewportCenter - stepTitleCenter;

      const newTranslateY = translateYRef.current + offset;
      setTranslateY(newTranslateY);
      translateYRef.current = newTranslateY;

      // Enable transitions after first positioning
      if (!isInitialized) {
        requestAnimationFrame(() => setIsInitialized(true));
      }
    };

    requestAnimationFrame(centerStep);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Handle step progression
  useEffect(() => {
    if (currentStep >= steps.length) return;

    const streamingTimer = setTimeout(() => {
      setStepPhase('streaming');
    }, STREAMING_START);

    const completionTimer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep]);
      setStepPhase('completed');

      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setStepPhase('inProgress');
          setVisibleUnits(0);
        }
      }, 100);
    }, STEP_DURATION);

    return () => {
      clearTimeout(streamingTimer);
      clearTimeout(completionTimer);
    };
  }, [currentStep]);

  // Handle streaming (word-by-word for text, item-by-item for arrays)
  useEffect(() => {
    if (stepPhase !== 'streaming') return;

    const units = getStreamingUnits();
    const streamingDuration = STEP_DURATION - STREAMING_START;
    const unitInterval = streamingDuration / units.length;

    const interval = setInterval(() => {
      setVisibleUnits(prev => {
        if (prev >= units.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, unitInterval);

    return () => clearInterval(interval);
  }, [stepPhase, getStreamingUnits]);

  const isStepCompleted = (index) => completedSteps.includes(index);
  const isCurrentStep = (index) => index === currentStep && !isStepCompleted(index);

  const renderSummary = (step, index) => {
    const isCompleted = isStepCompleted(index);
    const isCurrent = isCurrentStep(index);
    const isStreaming = isCurrent && (stepPhase === 'streaming' || stepPhase === 'completed');

    if (!isCompleted && !isStreaming) return null;

    // Handle array summaries (search queries)
    if (Array.isArray(step.summary)) {
      const visibleItems = isCompleted ? step.summary : step.summary.slice(0, visibleUnits);
      return (
        <div className="step-summary search-queries">
          {visibleItems.map((query, i) => (
            <div key={i} className="search-query">
              <MagnifyingGlass size={20} className="search-icon" />
              <span>{query}</span>
            </div>
          ))}
        </div>
      );
    }

    // Handle text summaries
    if (isCompleted) {
      return <p className="step-summary">{step.summary}</p>;
    }

    // Streaming: render each word with animation
    const words = step.summary.split(' ').slice(0, visibleUnits);
    return (
      <p className="step-summary streaming">
        {words.map((word, i) => (
          <span key={i} className="word">{word} </span>
        ))}
      </p>
    );
  };

  return (
    <div className="research-loader">
      <div
        className={`timeline ${isInitialized ? 'initialized' : ''}`}
        ref={timelineRef}
        style={{ transform: `translateY(${translateY}px)` }}
      >
        {steps.slice(0, currentStep + 1).map((step, index) => (
          <div
            className={`step ${isStepCompleted(index) ? 'completed' : ''} ${isCurrentStep(index) ? 'current' : ''}`}
            key={step.id}
            ref={isCurrentStep(index) ? currentStepRef : null}
          >
            <div className="step-indicator">
              {isStepCompleted(index) ? (
                <CheckCircle size={24} className="check-icon" />
              ) : (
                <div className="pulsing-dot" />
              )}
              {index < currentStep && <div className="connector-line" />}
            </div>
            <div className="step-content">
              <span className="step-title">
                {isStepCompleted(index) ? step.completed : step.inProgress}
              </span>
              {renderSummary(step, index)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResearchLoader;
