import { motion } from "framer-motion";
import { fadeUp, viewport } from "./anim";

export const WebMeetsCyber = () => (
  <section className="relative py-32 px-6 lg:px-16 xl:px-24">
    <div className="max-w-7xl mx-auto">

      <div className="flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-cinematic text-3xl md:text-5xl uppercase tracking-wide text-slate-900 dark:text-white mb-4"
        >
          Quand le <span className="text-red-600 dark:text-red-500">Web</span> rencontre la <span className="text-red-600 dark:text-red-500">Cybersécurité</span>
        </motion.h2>

        <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent mb-6" />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="max-w-3xl text-slate-600 dark:text-gray-400 text-base md:text-lg leading-relaxed"
        >
          Les attaques réseau génèrent des dizaines d'alertes en quelques secondes — sans outil adapté,
          il est impossible de s'y retrouver. Avec{" "}
          <span className="font-cinematic text-red-600 dark:text-red-500">Tracks4Hacks</span>,
          nous avons voulu construire le tableau de bord qui nous aurait manqué pendant nos simulations :
          une vue unifiée, en temps réel, qui traduit chaque action offensive en signal défensif lisible.
        </motion.p>
      </div>

    </div>
  </section>
);
