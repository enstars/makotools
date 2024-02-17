import { useEffect } from "react";
import { useParallaxController } from "react-scroll-parallax";
import { useRouter } from "next/router";

export function ParallaxCacheUpdater() {
  const parallaxController = useParallaxController();
  const router = useRouter();

  useEffect(() => {
    if (parallaxController) parallaxController.update();
  }, [router.asPath, parallaxController]);

  return null;
}
