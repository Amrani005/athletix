import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

export const animateWithGsap=(target: gsap.TweenTarget,animationProps: gsap.TweenVars,
scrollProps: gsap.DOMTarget | ScrollTrigger.Vars | undefined)=>{
  gsap.to(target,{
    ...animationProps,
    scrollTrigger:{
      trigger: typeof target === 'string' || target instanceof Element ? target : undefined,
      toggleActions:'restart reverse restart reverse',
      start:'top 85%',
      ...(typeof scrollProps === 'object' && scrollProps !== null ? scrollProps : {}),
    }
  })
}


export const animateWithGsapTimeline = (
  timeline: { to: (arg0: any, arg1: { x: any; duration: number; ease: string; }, arg2: string | undefined) => void; },
  rotationRef: { current: { rotation: any; }; },
  rotationState: any,
  firstTarget: any,
  secondTarget: any,
  animationProps: any
) => {
  timeline.to(rotationRef.current.rotation, {
    x: rotationState,
    duration: 1,
    ease: 'power2.inOut',
  }, '<');

  
  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: 'power2.inOut'
      
    },
    '<'
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: 'power2.inOut',
      
    },
    '<'
  );
};
