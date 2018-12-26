import Quiz from './Quiz';
import Provider from './Provider';

export default class Kani implements Provider {
    private index: number = 0;
    private readonly quizzes: Quiz[] = [
        new Quiz(
            1,
            '越前かには一年中とってよい',
            'https://2.bp.blogspot.com/-DRb3BnOxdkI/Ut0BGIW0WPI/AAAAAAAAdSc/ElVKsxiY2R8/s800/ocean_night.png',
            '1問目ここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいります',
            false),
        new Quiz(
            2,
            '越前かには松葉かにと同じ種類のかにである',
            'https://3.bp.blogspot.com/-odgGti-5z8I/V_4btQaDAsI/AAAAAAAA-u4/hEiqFSQZBEkZvGGQ87-lWjT3hHbvi7rGgCLcB/s400/moses_umi.png',
            '2問目ここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいります',
            true),
        new Quiz(
            3,
            '越前かに漁の解禁日は、毎年11月6日で決まっている',
            'https://2.bp.blogspot.com/-Qb4PifD_GJ0/U5l53yU1gPI/AAAAAAAAhUQ/EsXm6rCGwCw/s450/animal_shachi_killer_whale.png',
            '3問目ここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいりますここに説明がはいります',
            true),
    ];

    public getQuizByNo(no: number): Quiz | undefined {
        return this.quizzes.find(q => q.getNo() === no);
    }

    public init(): Quiz {
        this.index = 0;
        return this.quizzes[this.index];
    }

    public current(): Quiz {
        return this.quizzes[this.index];
    }

    public hasNext(): boolean {
        return this.quizzes.length - 1 > this.index;
    }

    public next(): Quiz {
        return this.quizzes[this.index++];
    }
}
